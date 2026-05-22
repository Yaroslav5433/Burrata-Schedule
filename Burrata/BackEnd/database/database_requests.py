from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from database.models import Admin, Users, ClaimsSchedule, Shifts



async def get_admin_for_login(login_data, db: AsyncSession):
    verified_admin = await db.execute(select(Admin).filter(Admin.login == login_data))
    
    return verified_admin.scalar_one_or_none()


async def get_user_by_id(unique_id_number, db: AsyncSession):
    verified_user = await db.execute(select(Users).filter(Users.unique_id_number == unique_id_number))
    
    return verified_user.scalar_one_or_none()


async def get_users_saved_claims(verified_user, this_week_days, db: AsyncSession):
    user_saved_claims_rows = await db.execute(select(ClaimsSchedule.date, ClaimsSchedule.shift).where(
            ClaimsSchedule.username == verified_user.username,
            ClaimsSchedule.date.in_(this_week_days)
        ))
    
    return user_saved_claims_rows


async def insert_claims_in_database(username, claims_sql_type, db: AsyncSession):
    success_on_insert = await db.execute(insert(ClaimsSchedule).values([
        {"date": date, "shift": Shifts(shift), "username": username}
        for date, shift in claims_sql_type.items()
    ]))

    await db.commit()

    return success_on_insert