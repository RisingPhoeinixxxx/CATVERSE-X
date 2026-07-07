from datetime import datetime

from pydantic import BaseModel
from pydantic import EmailStr


# ==========================
# Register Request
# ==========================

class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str


# ==========================
# Login Request
# ==========================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# ==========================
# Response
# ==========================

class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    guardian_level: int

    created_at: datetime

    class Config:

        from_attributes = True

class Token(BaseModel):

    access_token: str

    token_type: str

    guardian: str

    level: int