from pydantic import BaseModel
from typing import Optional


class CatCreate(BaseModel):
    name: str
    breed: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    latitude: float
    longitude: float


class CatResponse(CatCreate):
    id: int
    image_url: Optional[str]
    health_score: float
    ai_score: float
    status: str

    class Config:
        from_attributes = True