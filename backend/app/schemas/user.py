from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    guardian_level: int
    guardian_xp: int
    total_rescues: int

    class Config:
        from_attributes = True

