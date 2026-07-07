from fastapi import APIRouter
from fastapi import Depends

from app.dependencies import get_current_user
from app.models import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "guardian_level": current_user.guardian_level,
        "created_at": current_user.created_at
    }