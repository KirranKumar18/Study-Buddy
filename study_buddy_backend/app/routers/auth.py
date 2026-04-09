from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas, models
from app.database import get_db
from app.auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_refresh_token, get_current_user
)
from datetime import datetime

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user and return access + refresh tokens."""
    # Check if email already exists
    existing_user = await crud.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create the user
    hashed_pw = hash_password(user_data.password)
    db_user = await crud.create_user(db, user_data.username, user_data.email, hashed_pw)
    
    # Generate tokens
    access_token = create_access_token(db_user.id)
    refresh_token_str, refresh_expires = create_refresh_token(db_user.id)
    
    # Store refresh token in DB
    await crud.create_refresh_token(db, refresh_token_str, db_user.id, refresh_expires)
    
    return schemas.TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        user=schemas.UserResponse.model_validate(db_user)
    )

@router.post("/login", response_model=schemas.TokenResponse)
async def login(
    user_data: schemas.UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate a user and return access + refresh tokens."""
    # Find user by email
    db_user = await crud.get_user_by_email(db, user_data.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate tokens
    access_token = create_access_token(db_user.id)
    refresh_token_str, refresh_expires = create_refresh_token(db_user.id)
    
    # Store refresh token in DB
    await crud.create_refresh_token(db, refresh_token_str, db_user.id, refresh_expires)
    
    return schemas.TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        user=schemas.UserResponse.model_validate(db_user)
    )

@router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_token(
    token_data: schemas.RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Exchange a valid refresh token for a new access token + refresh token pair."""
    # Decode the refresh token
    user_id = decode_refresh_token(token_data.refresh_token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Check if the refresh token exists in DB and is not revoked
    db_token = await crud.get_refresh_token(db, token_data.refresh_token)
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked or does not exist"
        )
    
    # Check expiration
    if db_token.expires_at < datetime.utcnow():
        await crud.revoke_refresh_token(db, token_data.refresh_token)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired"
        )
    
    # Revoke the old refresh token (rotation)
    await crud.revoke_refresh_token(db, token_data.refresh_token)
    
    # Get the user
    db_user = await crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Generate new token pair
    new_access_token = create_access_token(db_user.id)
    new_refresh_token, new_refresh_expires = create_refresh_token(db_user.id)
    
    # Store new refresh token
    await crud.create_refresh_token(db, new_refresh_token, db_user.id, new_refresh_expires)
    
    return schemas.TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user=schemas.UserResponse.model_validate(db_user)
    )

@router.post("/logout")
async def logout(
    token_data: schemas.RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Revoke a refresh token (logout)."""
    await crud.revoke_refresh_token(db, token_data.refresh_token)
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserResponse)
async def get_me(
    current_user: models.User = Depends(get_current_user)
):
    """Return the currently authenticated user's profile."""
    return current_user
