"""Script to drop all existing tables and recreate them with the new schema."""
import asyncio
from app.database import engine, Base
from app import models  # Import models to register them with Base

async def reset_db():
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables with new schema...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done! Database has been reset.")

if __name__ == "__main__":
    asyncio.run(reset_db())
