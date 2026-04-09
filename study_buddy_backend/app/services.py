import httpx
import google.generativeai as genai
from googleapiclient.discovery import build
from app.config import settings
from typing import List, Dict, Any
from datetime import date
import json
import asyncio  # <-- CHANGE 1: Import asyncio

# --- Updated Gemini Service ---
class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash",  # <-- This is correct from your list
            generation_config={"response_mime_type": "application/json"}
        )

    async def generate_study_plan(
        self, subject: str, exam_date: str, daily_study_time: int, 
        session_length: int, topics: List[str], notes: str, internet_context: str
    ) -> List[Dict[str, Any]]:
        
        prompt = f"""
        You are an expert study planner. Create an efficient, day-by-day study plan for a student.

        **Student's Goal:**
        - Subject: {subject}
        - Exam Date: {exam_date}
        - Daily Study Time: {daily_study_time} minutes
        - Preferred Session Length: {session_length} minutes

        **Topics to Cover:**
        {', '.join(topics)}

        **Student's Personal Notes:**
        {notes or "No notes provided."}

        **Context from Internet Search on Topics:**
        {internet_context}

        **Your Task:**
        Generate a JSON list of daily study sessions from today ({date.today()}) until the exam date ({exam_date}). 
        Each session object in the list must have the following exact structure:
        {{
            "date": "YYYY-MM-DD",
            "topic_title": "Concise topic for the day (e.g., 'Newton's First Law and Inertia')",
            "topic_summary": "A 2-3 sentence summary of the key concepts to study for this topic. This summary will be given to the user at the start of the session.",
            "learning_objectives": ["A list", "of 3-5", "specific, actionable", "learning goals for the day."]
        }}
        
        **Rules:**
        - Be efficient. Combine related subtopics.
        - Ensure all topics are covered.
        - Add review/buffer days.
        - Your entire output must be *only* the valid JSON list.
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            # The model is configured to return JSON, so we can parse directly
            result = json.loads(response.text)
            
            if isinstance(result, list):
                return result
            # Handle if it's nested (e.g., {"schedule": [...]})
            elif isinstance(result, dict):
                for key, value in result.items():
                    if isinstance(value, list):
                        return value
            raise ValueError("No valid schedule list found in Gemini response")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing study plan from Gemini: {e}\nRaw text: {response.text}")
            return []
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return []

    async def generate_daily_quiz(self, topic: str, summary: str) -> List[Dict[str, Any]]:
        prompt = f"""
        Generate a 5-question multiple-choice quiz based on the following study topic and summary.
        
        Topic: {topic}
        Summary: {summary}
        
        Provide your response as a JSON list. Each object in the list must have:
        - "question": The question text.
        - "options": A list of 4 strings (A, B, C, D).
        - "correct_answer": The full text of the correct option.
        - "explanation": A brief explanation for why that answer is correct.
        
        Example:
        [
            {{
                "question": "What is Newton's First Law also known as?",
                "options": ["Law of Inertia", "Law of Acceleration", "Law of Action-Reaction", "Law of Gravity"],
                "correct_answer": "Law of Inertia",
                "explanation": "Newton's First Law describes inertia, an object's resistance to a change in motion."
            }}
        ]
        
        Output *only* the valid JSON list.
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            # The model is configured to return JSON, so we can parse directly
            result = json.loads(response.text)
            
            if isinstance(result, list):
                return result
            elif isinstance(result, dict):
                for key, value in result.items():
                    if isinstance(value, list):
                        return value
            raise ValueError("No valid quiz list found in Gemini response")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing quiz from Gemini: {e}\nRaw text: {response.text}")
            return []
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return []


# --- GoogleSearchService (Stays the same) ---
class GoogleSearchService:
    def __init__(self):
        self.api_key = settings.GOOGLE_SEARCH_API_KEY
        self.cse_id = settings.GOOGLE_CSE_ID
        self.service = build("customsearch", "v1", developerKey=self.api_key)

    async def search_topics(self, topics: List[str]) -> str:
        """Searches for multiple topics and returns a compiled string of snippets."""
        all_snippets = []
        # We removed the unused 'httpx' client here
        for topic in topics:
            try:
                list_request = self.service.cse().list(
                    q=f"{topic} key concepts",
                    cx=self.cse_id,
                    num=2  # Get top 2 results for each topic
                )
                # <-- CHANGE 2: Run the blocking .execute() in a thread
                res = await asyncio.to_thread(list_request.execute)
                
                if "items" in res:
                    for item in res["items"]:
                        snippet = item.get("snippet", "").replace("\n", " ")
                        all_snippets.append(f"Topic: {topic}\nContext: {snippet}\n")
            except Exception as e:
                print(f"Error searching for topic {topic}: {e}")
                all_snippets.append(f"Topic: {topic}\nContext: Could not retrieve search results.\n")
        
        return "\n".join(all_snippets)


# --- YouTubeService (Stays the same) ---
class YouTubeService:
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.service = build("youtube", "v3", developerKey=self.api_key)

    async def search_videos(self, topic: str, subject: str) -> List[Dict[str, str]]:
        """Searches YouTube for videos related to the topic and subject."""
        query = f"{topic} {subject} tutorial"
        try:
            request = self.service.search().list(
                part="snippet",
                q=query,
                type="video",
                maxResults=3 # Get top 3 videos
            )
            # <-- CHANGE 3: Run the blocking .execute() in a thread
            response = await asyncio.to_thread(request.execute)
            
            videos = []
            if "items" in response:
                for item in response["items"]:
                    snippet = item["snippet"]
                    video_id = item["id"]["videoId"]
                    videos.append({
                        "title": snippet["title"],
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "channel": snippet["channelTitle"]
                    })
            return videos
        except Exception as e:
            print(f"Error searching YouTube: {e}")
            return []

# --- Instantiate NEW services ---
gemini_service = GeminiService()
google_search_service = GoogleSearchService()
youtube_service = YouTubeService()