from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from database.database import Base
import bcrypt


class Admin(Base):
    __tablename__ = 'admin'

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            self.hashed_password.encode("utf-8"))
    

class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    unique_id_number = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)


class ClaimsSchedule(Base):
    __tablename__ = 'claimsschedule'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    date = Column(DateTime, nullable=False)
    shift = Column(String, nullable=False)
    
