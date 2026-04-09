from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app import models, schemas
from datetime import date, datetime, timedelta
from typing import List, Dict, Any, Optional
import json

# --- User CRUD ---

async def create_user(db: AsyncSession, username: str, email: str, hashed_password: str) -> models.User:
    db_user = models.User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    result = await db.execute(
        select(models.User).where(models.User.email == email)
    )
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[models.User]:
    result = await db.execute(
        select(models.User).where(models.User.id == user_id)
    )
    return result.scalars().first()

# --- RefreshToken CRUD ---

async def create_refresh_token(db: AsyncSession, token: str, user_id: int, expires_at: datetime) -> models.RefreshToken:
    db_token = models.RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_token)
    await db.commit()
    await db.refresh(db_token)
    return db_token

async def get_refresh_token(db: AsyncSession, token: str) -> Optional[models.RefreshToken]:
    result = await db.execute(
        select(models.RefreshToken)
        .where(models.RefreshToken.token == token)
        .where(models.RefreshToken.revoked == False)
    )
    return result.scalars().first()

async def revoke_refresh_token(db: AsyncSession, token: str) -> None:
    result = await db.execute(
        select(models.RefreshToken).where(models.RefreshToken.token == token)
    )
    db_token = result.scalars().first()
    if db_token:
        db_token.revoked = True
        db.add(db_token)
        await db.commit()

async def revoke_all_user_tokens(db: AsyncSession, user_id: int) -> None:
    result = await db.execute(
        select(models.RefreshToken)
        .where(models.RefreshToken.user_id == user_id)
        .where(models.RefreshToken.revoked == False)
    )
    tokens = result.scalars().all()
    for token in tokens:
        token.revoked = True
        db.add(token)
    await db.commit()

# --- StudyPlan CRUD ---

async def create_study_plan(db: AsyncSession, plan: schemas.StudyPlanCreate, generated_sessions: List[Dict[str, Any]], user_id: int) -> models.StudyPlan:
    # Create the main plan
    db_plan = models.StudyPlan(
        user_id=user_id,
        subject=plan.subject,
        exam_date=plan.exam_date,
        daily_study_time=plan.daily_study_time,
        session_length=plan.session_length,
        notes=plan.notes
    )
    db.add(db_plan)
    await db.flush()  # Flush to get the db_plan.id

    # Create all daily sessions
    for session_data in generated_sessions:
        db_session = models.DailySession(
            plan_id=db_plan.id,
            date=date.fromisoformat(session_data["date"]),
            topic_title=session_data["topic_title"],
            topic_summary=session_data["topic_summary"],
            learning_objectives=session_data["learning_objectives"]
        )
        db.add(db_session)
    
    await db.commit()
    await db.refresh(db_plan, ["daily_sessions"]) # Refresh to load the sessions
    return db_plan

async def get_plan(db: AsyncSession, plan_id: int, user_id: int) -> Optional[models.StudyPlan]:
    result = await db.execute(
        select(models.StudyPlan)
        .where(models.StudyPlan.id == plan_id)
        .where(models.StudyPlan.user_id == user_id)
        .options(selectinload(models.StudyPlan.daily_sessions))
    )
    return result.scalars().first()

# --- DailySession CRUD ---

async def get_daily_session_by_date(db: AsyncSession, plan_id: int, target_date: date) -> Optional[models.DailySession]:
    result = await db.execute(
        select(models.DailySession)
        .where(models.DailySession.plan_id == plan_id)
        .where(models.DailySession.date == target_date)
    )
    return result.scalars().first()

async def update_daily_session_content(db: AsyncSession, session: models.DailySession, videos: List[Dict], quiz: List[Dict]) -> models.DailySession:
    session.youtube_links = videos
    session.quiz_data = quiz
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

async def get_all_plans(db: AsyncSession, user_id: int) -> List[models.StudyPlan]:
    result = await db.execute(
        select(models.StudyPlan)
        .where(models.StudyPlan.user_id == user_id)
        .options(selectinload(models.StudyPlan.daily_sessions))
        .order_by(models.StudyPlan.id.desc())
    )
    return result.scalars().all()