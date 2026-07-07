from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey

from app.database import Base


class Leaderboard(Base):

    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    xp = Column(Integer, default=0)

    rank = Column(Integer, default=0)

    rescues = Column(Integer, default=0)