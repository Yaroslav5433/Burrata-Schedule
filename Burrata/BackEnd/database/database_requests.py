from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from sqlalchemy.dialects.postgresql import insert as pginsert
from database.models import Admin, Users, ClaimsSchedule, Schedule
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


async def insert_shifts_in_database(username: str, claims_sql_type, db: AsyncSession, claims: bool = False):

    model = ClaimsSchedule if claims else Schedule

    success_on_insert = pginsert(model).values([
        {"date": date,
         "shift": shift,
         "username": username}
        for date, shift in claims_sql_type.items()
    ])

    success_on_insert = success_on_insert.on_conflict_do_update(
        index_elements=["date", "username"],
        set_={"shift": success_on_insert.excluded.shift}
    )

    res = await db.execute(success_on_insert)

    await db.commit()

    return res.rowcount > 0


async def get_all_users(db: AsyncSession):
    all_users = await db.execute(select(Users.username))

    return {
        username: [""] * 7
        for username in all_users.scalars()
    }


async def get_all_users_saved_shifts(db: AsyncSession, week_dates, claims: bool = False):
    if claims:
        res = await db.execute(select(ClaimsSchedule.username, ClaimsSchedule.date, ClaimsSchedule.shift).where(
            ClaimsSchedule.date.in_(week_dates)
        ))
    else: res = await db.execute(select(Schedule.username, Schedule.date, Schedule.shift).where(
            Schedule.date.in_(week_dates)
        ))

    new_dict = {}

    for username, date, shift in res:
        if username not in new_dict:
            new_dict[username] = {}

        new_dict[username][transform_datetime_item_to_str(date)] = shift

    return new_dict


