from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete
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


async def get_all_users(db: AsyncSession, requested_department):
    all_users = await db.execute(select(Users.username, Users.unique_id_number, Users.position, Users.is_trainee).where(
        Users.position == requested_department
    ))

    users = {
        username: {
            "shifts": [""] * 7,
            "unique_id_number": unique_id_number,
            "position": position,
            "is_trainee": is_trainee,
        }
        for username, unique_id_number, position, is_trainee in all_users.all()
    }

    return users


async def get_all_users_saved_shifts(db: AsyncSession, week_dates, requested_position, claims: bool = False):
    if claims:
        res = await db.execute(select(ClaimsSchedule.username, ClaimsSchedule.date, ClaimsSchedule.shift).join(
            Users, Users.username == ClaimsSchedule.username).where(
            ClaimsSchedule.date.in_(week_dates),
            Users.position == requested_position
        ))
    else: res = await db.execute(select(Schedule.username, Schedule.date, Schedule.shift).join(
        Users, Users.username == Schedule.username).where(
            Schedule.date.in_(week_dates),
            Users.position == requested_position
        ))

    new_dict = {}

    for username, date, shift in res:
        if username not in new_dict:
            new_dict[username] = {}

        new_dict[username][transform_datetime_item_to_str(date)] = shift

    return new_dict


async def insert_users_in_database(username: str, position: str, is_trainee: bool, unique_id_number: str, db: AsyncSession):
    success_on_insert = await db.execute(insert(Users).values({
        'username': username,
        'unique_id_number': unique_id_number,
        'position': position,
        'is_trainee': is_trainee,
        }
    ))

    await db.commit()

    return success_on_insert.rowcount > 0


async def get_user_by_id(unique_id_number: str, db: AsyncSession):
    verified_user = await db.execute(select(Users).filter(Users.unique_id_number == unique_id_number))
    
    return verified_user.scalar_one_or_none()


async def delete_user_by_name(username: str, db: AsyncSession):
    success_on_delete = await db.execute(delete(Users).where(Users.username == username))

    await db.commit()

    return success_on_delete.rowcount > 0