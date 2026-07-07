from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class RescueReport(Base):

    __tablename__ = "rescue_reports"

    id = Column(Integer, primary_key=True, index=True)

    cat_name = Column(String, nullable=True)

    status = Column(String, nullable=False)

    health = Column(String, nullable=False)

    priority = Column(String, nullable=False)

    description = Column(Text)

    latitude = Column(Float)

    longitude = Column(Float)

    image_url = Column(String, nullable=True)

    ai_summary = Column(Text, nullable=True)

    reporter_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    reporter = relationship("User")