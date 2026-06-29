from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete, and_, update
from sqlalchemy.dialects.postgresql import insert as pginsert
from database.models import Admin, Users, ClaimsSchedule, Schedule, Messages, Vacations
from utils.utils import transform_datetime_item_to_str
from datetime import datetime



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
    if requested_department == "all":
        all_users = await db.execute(select(Users.username, Users.unique_id_number, Users.position, Users.is_trainee))
    else: 
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

    sorted_users = dict(sorted(users.items()))

    return sorted_users


async def get_all_users_saved_shifts(db: AsyncSession, week_dates, requested_position, claims: bool = False):
    if claims:
        res = await db.execute(select(ClaimsSchedule.username, ClaimsSchedule.date, ClaimsSchedule.shift).join(
            Users, Users.username == ClaimsSchedule.username).where(
            ClaimsSchedule.date.in_(week_dates),
            Users.position == requested_position
        ))
    else: res = await db.execute(select(Users.username, Schedule.date, Schedule.shift).select_from(Users).outerjoin(
        Schedule, and_(Users.username == Schedule.username, Schedule.date.in_(week_dates))).where(
            Users.position == requested_position
        ))

    new_dict = {}

    for username, date, shift in res:
        if username not in new_dict:
            new_dict[username] = {}

        if date is not None:
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


async def insert_message(username: str, message: str, db: AsyncSession):
    success_on_insert = await db.execute(insert(Messages).values({
        'username': username,
        'message': message}))

    await db.commit()

    return success_on_insert.rowcount > 0


async def get_messages(db: AsyncSession, all: bool, page: int, number_of_elements: int, read: bool = False):
    if all:
        messages = await db.execute(select(Messages.username, Messages.message, Messages.created_at, Messages.id)
                            .where(Messages.read == read)
                            .order_by(Messages.created_at.desc()))
    else: 
        messages = await db.execute(select(Messages.username, Messages.message, Messages.created_at, Messages.id)
                            .where(Messages.read == read)
                            .order_by(Messages.created_at.desc())
                            .limit(number_of_elements)
                            .offset((page - 1) * number_of_elements)
    )

    return messages.mappings().all()


async def check_message_as_read(id: int, db: AsyncSession):
    success_on_check = await db.execute(update(Messages).where(Messages.id == id).values(read = True))

    await db.commit()

    return success_on_check.rowcount > 0


async def get_user_message(username: str, date, db: AsyncSession):
    message = await db.execute(select(Messages.message)
                .where(Messages.username == username, Messages.created_at > date)
                .order_by(Messages.created_at.desc())
                .limit(1))

    return message.scalars().first()


async def save_vacation_in_database(username: str, start_date: datetime, end_date: datetime, db: AsyncSession):
    success_on_insert = await db.execute(insert(Vacations).values({
        'username': username,
        'start_date': start_date,
        'end_date': end_date
    }))

    await db.commit()

    return success_on_insert.rowcount > 0

async def get_vacations(db: AsyncSession):
    vacations = await db.execute(select(Vacations.username, Vacations.start_date, Vacations.end_date)
                                 .order_by(Vacations.start_date))
    
    return vacations.mappings().all()


async def delete_vacation(username: str, db: AsyncSession):
    success_on_delete = await db.execute(delete(Vacations).where(Vacations.username == username))

    await db.commit()

    return success_on_delete.rowcount > 0