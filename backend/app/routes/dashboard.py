from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.user import User
from app.models.cat import Cat
from app.models.report import RescueReport

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats():

    db: Session = SessionLocal()

    try:

        total_guardians = db.query(User).count()

        total_cats = db.query(Cat).count()

        total_reports = db.query(RescueReport).count()

        critical_cats = (
            db.query(Cat)
            .filter(Cat.status == "Critical")
            .count()
        )

        rescued_cats = (
            db.query(Cat)
            .filter(Cat.status == "Rescued")
            .count()
        )

        adopted_cats = (
            db.query(Cat)
            .filter(Cat.status == "Adopted")
            .count()
        )

        avg_health = (
            db.query(func.avg(Cat.health_score))
            .scalar()
        ) or 0

        avg_ai = (
            db.query(func.avg(Cat.ai_score))
            .scalar()
        ) or 0

        return {

            "active_guardians": total_guardians,

            "total_cats": total_cats,

            "critical_cats": critical_cats,

            "rescued_cats": rescued_cats,

            "adopted_cats": adopted_cats,

            "rescue_reports": total_reports,

            "average_health": round(avg_health, 2),

            "average_ai": round(avg_ai, 2),

            "ai_status": "ONLINE"

        }

    finally:

        db.close()