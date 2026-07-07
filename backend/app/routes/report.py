from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.report import RescueReport
from app.schemas.report import ReportCreate
from app.schemas.report import ReportResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/report",
    tags=["Report"]
)


@router.post(
    "/",
    response_model=ReportResponse
)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_report = RescueReport(
    cat_name=report.cat_name,
    status=report.status,
    health=report.health,
    priority=report.priority,
    description=report.description,
    latitude=report.latitude,
    longitude=report.longitude,
    image_url="",
    ai_summary="Waiting for Kuro AI...",
    reporter_id=current_user.id
)

    print("Columns:", RescueReport.__table__.columns.keys())

    db.add(new_report)

    db.commit()

    db.refresh(new_report)

    return new_report