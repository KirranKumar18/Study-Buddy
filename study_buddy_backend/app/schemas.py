from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List, Optional, Dict, Any

# --- Auth Schemas ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# --- Video Schemas ---
class VideoLink(BaseModel):
    title: str
    url: str
    channel: str

# --- Quiz Schemas ---
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str # The text of the correct answer
    explanation: str

# --- Daily Session Schemas ---
class DailySessionBase(BaseModel):
    date: date
    topic_title: str
    topic_summary: str
    learning_objectives: List[str]

class DailySessionCreate(DailySessionBase):
    pass

class DailySession(DailySessionBase):
    id: int
    plan_id: int
    youtube_links: Optional[List[VideoLink]] = []
    quiz_data: Optional[List[QuizQuestion]] = []

    class Config:
        from_attributes = True

# --- Study Plan Schemas ---
class StudyPlanCreate(BaseModel):
    subject: str
    exam_date: date
    daily_study_time: int
    session_length: int
    topics: List[str]
    notes: Optional[str] = None

class StudyPlan(BaseModel):
    id: int
    subject: str
    exam_date: date
    daily_study_time: int
    session_length: int
    notes: Optional[str] = None
    daily_sessions: List[DailySession] = []

    class Config:
        from_attributes = True

# --- Response Schemas ---
class DailyContentResponse(BaseModel):
    session: DailySession
    youtube_links: List[VideoLink]
    quiz: List[QuizQuestion]