from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from app.database import Base


class Shelter(Base):

    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    address = Column(String)

    phone = Column(String)

    email = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    capacity = Column(Integer)

    current_animals = Column(Integer, default=0)