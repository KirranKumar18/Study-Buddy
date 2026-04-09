from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    YOUTUBE_API_KEY: str
    GOOGLE_SEARCH_API_KEY: str
    GOOGLE_CSE_ID: str
    
    # JWT Authentication
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    model_config = SettingsConfigDict(env_file=".env")

# Create a single instance to be imported by other files
settings = Settings()