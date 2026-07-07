from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cat import Cat

router = APIRouter(
    prefix="/adoptions",
    tags=["Adoptions"]
)


@router.get("/")
def get_adoptions(
    db: Session = Depends(get_db)
):

    cats = (
        db.query(Cat)
        .filter(Cat.status == "Adoption")
        .all()
    )

    return cats


@router.get("/stats")
def adoption_stats(
    db: Session = Depends(get_db)
):

    total = db.query(Cat).count()

    adoption = db.query(Cat).filter(
        Cat.status == "Adoption"
    ).count()

    return {

        "available": adoption,

        "adopted": total - adoption,

        "success": (
            round(
                ((total-adoption)/total)*100,
                2
            ) if total else 0
        )

    }