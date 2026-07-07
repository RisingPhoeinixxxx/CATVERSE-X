from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True)

    password = Column(String)

    guardian_level = Column(Integer, default=1)

    guardian_xp = Column(Integer, default=0)

    total_rescues = Column(Integer, default=0)

    avatar = Column(String, nullable=True)

    is_admin = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )