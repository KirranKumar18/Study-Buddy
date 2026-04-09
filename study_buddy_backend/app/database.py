from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Create the async engine
engine = create_async_engine(settings.DATABASE_URL)

# Create a session factory
async_session_local = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for our models
class Base(DeclarativeBase):
    pass

# Dependency to get a DB session in API endpoints
async def get_db():
    async with async_session_local() as session:
        yield session