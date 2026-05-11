from database import Base
from passlib.context import CryptContext

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Admin(Base):
    pass

class Users(Base):
    pass