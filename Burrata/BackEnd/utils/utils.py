from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

def transform_date_to_sql(values: dict):
    current_year = datetime.now().year

    newValues = {}

    for key, value in values.items():
        day_str, month_str = key.split(".")
        day = int(day_str)
        month = int(month_str)

        date_obj = datetime(current_year, month, day).date()

        newValues[date_obj] = value

    return newValues


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


def transform_datetime_item_to_str(datetime_item):
    return datetime_item.strftime("%d.%m")