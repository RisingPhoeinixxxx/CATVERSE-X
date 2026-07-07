from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mission import Mission
from app.models.report import RescueReport
from app.models.user import User

router = APIRouter(
    prefix="/missions",
    tags=["Missions"]
)


@router.get("/")
def get_missions(db: Session = Depends(get_db)):

    missions = db.query(Mission).all()

    result = []

    for mission in missions:

        report = db.query(RescueReport).filter(
            RescueReport.id == mission.report_id
        ).first()

        guardian = db.query(User).filter(
            User.id == mission.guardian_id
        ).first()

        result.append({

            "id": f"RX-{mission.id}",

            "type": report.status if report else "Rescue",

            "location": (
                f"{report.latitude}, {report.longitude}"
                if report else "Unknown"
            ),

            "priority": (
                report.priority if report else "Normal"
            ),

            "eta": "In Progress",

            "volunteer": (
                guardian.full_name if guardian else "Unassigned"
            ),

            "status": mission.status

        })

    return result
@router.get("/stats")
def mission_stats(db: Session = Depends(get_db)):

    missions = db.query(Mission).count()

    completed = db.query(Mission).filter(
        Mission.status == "Completed"
    ).count()

    volunteers = db.query(User).count()

    success = 0

    if missions:
        success = round(completed / missions * 100)

    return {

        "active": missions,
        "rescues": completed,
        "success": success,
        "volunteers": volunteers

    }