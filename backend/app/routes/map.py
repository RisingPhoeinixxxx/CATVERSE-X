from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cat import Cat
from app.models.report import RescueReport

router = APIRouter(
    prefix="/map",
    tags=["Map"]
)


@router.get("/")
def get_map_cats(
    db: Session = Depends(get_db)
):

    cats = db.query(Cat).all()

    return cats

@router.get("/activity")
def recent_activity(
    db: Session = Depends(get_db)
):

    reports = (

        db.query(RescueReport)

        .order_by(
            RescueReport.created_at.desc()
        )

        .limit(10)

        .all()

    )

    return reports