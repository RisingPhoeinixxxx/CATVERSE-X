from pydantic import BaseModel


class DashboardStats(BaseModel):

    active_guardians: int

    cats_saved: int

    mission_success: float

    ai_status: str