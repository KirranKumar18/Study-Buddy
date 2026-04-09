from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

# --- User Model ---
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    study_plans = relationship("StudyPlan", back_populates="owner", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="owner", cascade="all, delete-orphan")

# --- Refresh Token Model ---
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    
    # Relationship
    owner = relationship("User", back_populates="refresh_tokens")

# --- Study Plan Model ---
class StudyPlan(Base):
    __tablename__ = "study_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, index=True)
    exam_date = Column(Date)
    daily_study_time = Column(Integer)  # in minutes
    session_length = Column(Integer)    # in minutes
    notes = Column(Text, nullable=True)
    
    # Relationships
    owner = relationship("User", back_populates="study_plans")
    daily_sessions = relationship("DailySession", back_populates="plan", cascade="all, delete-orphan")

class DailySession(Base):
    __tablename__ = "daily_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("study_plans.id"))
    date = Column(Date, index=True)
    topic_title = Column(String)
    topic_summary = Column(Text)
    
    # Store complex data as JSON
    learning_objectives = Column(JSON) # List of strings
    youtube_links = Column(JSON, nullable=True) # List of video dicts
    quiz_data = Column(JSON, nullable=True)     # List of quiz question dicts
    
    # Relationship
    plan = relationship("StudyPlan", back_populates="daily_sessions")