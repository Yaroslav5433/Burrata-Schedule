from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, String, Boolean, UniqueConstraint
from database.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
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
    username = Column(String, nullable=False)
    department = Column(String, nullable=False)
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

    messages = relationship(
        "Messages",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    vacations = relationship(
        "Vacations",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    allowedshiftsvalues = relationship(
        "AllowedShiftsValues",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    maxshiftsweektotal = relationship(
        "MaxShiftsWeekTotal",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    
class ClaimsSchedule(Base):
    __tablename__ = 'claimsschedule'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, nullable=False)
    shift = Column(String, nullable=False)
    
    __table_args__ = (UniqueConstraint("date", "user_id"),)
    

class Schedule(Base):
    __tablename__ = 'schedule'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, nullable=False)
    shift = Column(String)

    __table_args__ = (UniqueConstraint("date", "user_id"),)
    

class Messages(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    message = Column(String, nullable=False)
    read = Column(Boolean, nullable=False, default=False)


class Vacations(Base):
    __tablename__ = 'vacations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (UniqueConstraint("user_id"),)


class AllowedShiftsValues(Base):
    __tablename__ = 'allowedshiftsvalues'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    day = Column(String, nullable=False)
    shiftvalue = Column(String, nullable=False)
    allowed = Column(Boolean, nullable=False)
    

class MaxShiftsWeekTotal(Base):
    __tablename__ = 'maxshiftsweektotal'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    shiftvalue = Column(String, unique=True, nullable=False)
    max_count = Column(Integer, nullable=False)

    __table_args__ = (CheckConstraint("max_count >= 0 AND max_count <= 7"),)


class DefaultWeekShifts(Base):
    __tablename__ = 'defaultweekshifts'

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, nullable=False, unique=True)
    first_shift = Column(Integer, nullable=False)
    second_shift = Column(Integer, nullable=False)