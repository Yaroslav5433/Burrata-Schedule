from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

def transform_date_to_sql(values):
    current_year = datetime.now().year

    newValues = {}

    for key, value in values.items():
        day_str, month_str = key.split(".")
        day = int(day_str)
        month = int(month_str)

        date_obj = datetime(current_year, month, day).date()

        newValues[date_obj] = value

    return newValues


def transform_date_and_shift_from_sql_to_str(values):
    result = {}
    for d, enum_value in values.items():
        if isinstance(d, date):
            date_str = d.strftime("%d.%m")
        else:
            date_str = str(d)
        if hasattr(enum_value, "value"):
                enum_str = str(enum_value.value)
        else:
            enum_str = str(enum_value)

        result[date_str] = enum_str

    return result


def get_current_week_days(nosql = False):
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    this_week = [start_of_week + timedelta(days=i) for i in range(7)]
    if nosql:
        this_week = [
        (start_of_week + timedelta(days=i)).strftime("%d.%m")
        for i in range(7)
        ]

    return this_week


def transfrom_row_sql_to_dict(row_sql):
    result = { 
        row["date"]: row["shift"]
        for row in row_sql.mappings() 
    }

    return result


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