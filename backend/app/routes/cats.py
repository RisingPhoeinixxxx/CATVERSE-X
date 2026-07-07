from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cat import Cat

router = APIRouter(
    prefix="/cats",
    tags=["Cats"]
)

@router.get("/")
def get_cats(
    db: Session = Depends(get_db)
):
    return db.query(Cat).all()