from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Cat(Base):

    __tablename__ = "cats"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    breed = Column(String)

    gender = Column(String)

    age = Column(String)

    color = Column(String)

    health_score = Column(Float)

    ai_score = Column(Float)

    status = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    image_url = Column(String)

    description = Column(String)

    reported_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )