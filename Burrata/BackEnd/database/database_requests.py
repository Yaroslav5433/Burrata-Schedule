from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from database.models import Admin, Users, ClaimsSchedule
from utils.utils import transform_datetime_item_to_str



async def get_admin_for_login(login_data: str, db: AsyncSession):
    verified_admin = await db.execute(select(Admin).filter(Admin.login == login_data))
    
    return verified_admin.scalar_one_or_none()


async def get_user_by_id(unique_id_number: str, db: AsyncSession):
    verified_user = await db.execute(select(Users).filter(Users.unique_id_number == unique_id_number))
    
    return verified_user.scalar_one_or_none()


async def get_user_saved_claims(verified_user: str, next_week_dates, db: AsyncSession):
    user_saved_claims = await db.execute(select(ClaimsSchedule.date, ClaimsSchedule.shift).where(
            ClaimsSchedule.username == verified_user.username,
            ClaimsSchedule.date.in_(next_week_dates)
        ))
    
    return {
    transform_datetime_item_to_str(date): shift
    for date, shift in user_saved_claims
    }


async def insert_claims_in_database(username: str, claims_sql_type, db: AsyncSession):
    success_on_insert = await db.execute(insert(ClaimsSchedule).values([
        {"date": date,
         "shift": shift,
         "username": username}
        for date, shift in claims_sql_type.items()
    ]))

    await db.commit()

    return success_on_insert


async def get_all_users(db: AsyncSession):
    all_users = await db.execute(select(Users.username))

    return {
        username: [""] * 7
        for username in all_users.scalars()
    }


async def get_all_users_saved_claims(db: AsyncSession, week_dates):
    all_users_claims = await db.execute(select(ClaimsSchedule.username, ClaimsSchedule.date, ClaimsSchedule.shift).where(
        ClaimsSchedule.date.in_(week_dates)
    ))

    return [
        {
            "username": username,
            transform_datetime_item_to_str(date): shift
        }
        for username, date, shift in all_users_claims]