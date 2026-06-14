from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean, UniqueConstraint
from database.database import Base
from sqlalchemy.orm import relationship
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
    position = Column(String, nullable=False)
    is_trainee = Column(Boolean, nullable=False, default=False)

    claims = relationship(
        "ClaimsSchedule",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    schedules = relationship(
        "Schedule",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class ClaimsSchedule(Base):
    __tablename__ = 'claimsschedule'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, nullable=False)
    shift = Column(String, nullable=False)
    
    __table_args__ = (UniqueConstraint("date", "username"),)
    

class Schedule(Base):
    __tablename__ = 'schedule'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, nullable=False)
    shift = Column(String)

    __table_args__ = (UniqueConstraint("date", "username"),)
    