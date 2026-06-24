from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo


def prepare_shifts_for_sql_insert(shifts: list[str], next_week_dates: list[datetime]):
    result = {}

    for shift, date_str in zip(shifts, next_week_dates):
        result[date_str] = shift

    return result


def get_next_week_dates(nosql: bool = False, steps: int = 0):
    today = date.today()
    start_of_next_week = today - timedelta(days = today.weekday()) + timedelta(days = 7 + steps)
    week = [start_of_next_week + timedelta(days = i) for i in range(7)]
    if nosql:
        week = [date_item.strftime("%d.%m") for date_item in week]

    return week


def get_seconds_to_next_monday():
    now = datetime.now(ZoneInfo("Europe/Sofia"))

    print(now)
    days_ahead_to_monday = (7 - now.weekday())

    target_date = (now + timedelta(days=days_ahead_to_monday)).replace(
        hour=0,
        minute=0,
        second=0
    )

    seconds = int((target_date - now).total_seconds())

    return seconds


def transform_datetime_item_to_str(datetime_item: datetime):
    return datetime_item.strftime("%d.%m")


def transform_str_item_to_datetime(str_item: str):
    return datetime.strptime(str_item, "%Y-%m-%d")


def interpret_claims_as_list(user_saved_claims: dict, next_week_dates: list[str]):
    return [user_saved_claims.get(date, "") for date in next_week_dates]