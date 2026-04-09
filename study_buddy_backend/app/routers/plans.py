from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas, models
from app.database import get_db
from app.auth import get_current_user
from app.services import gemini_service, google_search_service, youtube_service
from typing import List
from datetime import date

router = APIRouter(
    prefix="/plans",
    tags=["Study Plans"]
)

@router.post("/", response_model=schemas.StudyPlan, status_code=status.HTTP_201_CREATED)
async def create_new_study_plan(
    plan: schemas.StudyPlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new study plan for the authenticated user.
    This generates the full daily schedule using AI based on topics and notes.
    """
    try:
        # 1. Analyze topics on the internet
        internet_context = await google_search_service.search_topics(plan.topics)
        
        # 2. Generate the study plan schedule using Gemini
        generated_sessions = await gemini_service.generate_study_plan(
            subject=plan.subject,
            exam_date=str(plan.exam_date),
            daily_study_time=plan.daily_study_time,
            session_length=plan.session_length,
            topics=plan.topics,
            notes=plan.notes,
            internet_context=internet_context
        )
        
        if not generated_sessions:
            raise HTTPException(status_code=500, detail="Failed to generate study plan from AI")
            
        # 3. Save the plan and all its sessions to the database
        db_plan = await crud.create_study_plan(db, plan, generated_sessions, user_id=current_user.id)
        return db_plan
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[schemas.StudyPlan])
async def get_all_study_plans(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all study plans for the authenticated user.
    """
    return await crud.get_all_plans(db, user_id=current_user.id)


@router.get("/{plan_id}", response_model=schemas.StudyPlan)
async def get_study_plan_details(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve a specific study plan and all its associated daily sessions.
    Only the plan owner can access it.
    """
    db_plan = await crud.get_plan(db, plan_id, user_id=current_user.id)
    if db_plan is None:
        raise HTTPException(status_code=404, detail="Study plan not found")
    return db_plan

@router.get("/{plan_id}/day/{date_str}", response_model=schemas.DailyContentResponse)
async def get_session_content_for_date(
    plan_id: int,
    date_str: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get all content for a specific day's study session.
    
    This will:
    1. Find the scheduled session for the given date.
    2. If not already generated, it will call YouTube and Gemini to get
       videos and a quiz.
    3. Cache and return all content.
    """
    try:
        target_date = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
        
    session = await crud.get_daily_session_by_date(db, plan_id, target_date)
    
    if session is None:
        raise HTTPException(status_code=404, detail=f"No study session found for date: {date_str}")
    
    plan = await crud.get_plan(db, plan_id, user_id=current_user.id)
    if plan is None:
         raise HTTPException(status_code=404, detail="Parent study plan not found.")

    videos = session.youtube_links
    quiz = session.quiz_data
    
    # Check if content needs to be generated (run once per session)
    needs_generation = not videos or not quiz
    
    if needs_generation:
        # 2. Search for YouTube videos
        videos = await youtube_service.search_videos(
            topic=session.topic_title,
            subject=plan.subject
        )
        
        # 3. Generate daily quiz
        quiz = await gemini_service.generate_daily_quiz(
            topic=session.topic_title,
            summary=session.topic_summary
        )
        
        # 4. Cache results in the DB
        session = await crud.update_daily_session_content(db, session, videos, quiz)

    return schemas.DailyContentResponse(
        session=session,
        youtube_links=videos,
        quiz=quiz
    )