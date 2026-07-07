from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.shelter import Shelter

router = APIRouter(
    prefix="/shelters",
    tags=["Shelters"]
)


@router.get("/")
def get_shelters(
    db: Session = Depends(get_db)
):
    return db.query(Shelter).all()


@router.get("/stats")
def shelter_stats(
    db: Session = Depends(get_db)
):

    shelters = db.query(Shelter).all()

    registered = len(shelters)

    beds = sum(
        s.capacity - s.current_animals
        for s in shelters
    )

    capacity = sum(
        s.capacity
        for s in shelters
    )

    current = sum(
        s.current_animals
        for s in shelters
    )

    return {

        "registered": registered,

        "beds": beds,

        "adoptions": current,

        "vets": registered

    }