from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import plans, auth

app = FastAPI(
    title="Study-Buddy API",
    description="AI-powered study planner backend."
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include the API routers
app.include_router(auth.router)
app.include_router(plans.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Study-Buddy API!"}