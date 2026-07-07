from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class Mission(Base):

    __tablename__ = "missions"

    id = Column(Integer, primary_key=True)

    report_id = Column(
        Integer,
        ForeignKey("rescue_reports.id")
    )

    guardian_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    status = Column(String, default="Assigned")

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    completed_at = Column(DateTime)