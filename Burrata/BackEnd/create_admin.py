import asyncio
import bcrypt

from database.database import async_session_factory
from database.models import Admin


async def create_admin():
    password = "halachev"

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    async with async_session_factory() as session:
        admin = Admin(
            login="admin",
            hashed_password=hashed_password
        )

        session.add(admin)
        await session.commit()

        print("Admin created")


if __name__ == "__main__":
    asyncio.run(create_admin())