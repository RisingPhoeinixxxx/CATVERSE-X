from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReportCreate(BaseModel):

    cat_name: Optional[str] = None

    status: str

    health: str

    priority: str

    description: str

    latitude: float

    longitude: float


class ReportResponse(BaseModel):

    id: int

    cat_name: Optional[str]

    status: str

    health: str

    priority: str

    description: str

    latitude: float

    longitude: float

    image_url: Optional[str]

    ai_summary: Optional[str]

    created_at: datetime

    class Config:
        from_attributes = True