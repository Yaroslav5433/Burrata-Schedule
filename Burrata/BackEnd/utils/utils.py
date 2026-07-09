from datetime import datetime, date, timedelta
from .constants import basic_shifts_insert, basic_total_insert


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

def get_this_monday():
    return date.today() - timedelta(days = date.today().weekday())


def transform_datetime_item_to_str(datetime_item: datetime):
    return datetime_item.strftime("%d.%m")


def transform_str_item_to_datetime(str_item: str):
    return datetime.strptime(str_item, "%Y-%m-%d")


def interpret_claims_as_list(user_saved_claims: dict, next_week_dates: list[str]):
    return [user_saved_claims.get(date, "") for date in next_week_dates]

def vacations_to_week(vacations: dict, dates: list):
    result = {}

    for vacation in vacations:
        username = vacation["username"]

        start = vacation["start_date"]
        end = vacation["end_date"]

        start = start.date() if hasattr(start, "date") else start
        end = end.date() if hasattr(end, "date") else end

        if username not in result:
            result[username] = [""] * 7

        for i, day in enumerate(dates):
            if start <= day <= end:
                result[username][i] = "V"

    return result


def get_two_days_before(date_str: str):
    current_date = datetime.strptime(date_str, "%d.%m")

    return [
        current_date - timedelta(days=1),
        current_date - timedelta(days=2),
    ]

def merge_to_nine_days(seven_days_claims: dict, two_days_claims: dict):
    result = {}

    all_users = set(seven_days_claims.keys()) | set(two_days_claims.keys())

    for user in all_users:
        two = two_days_claims.get(user, [""] * 2)
        seven = seven_days_claims.get(user, [""] * 7)

        result[user] = two + seven

    return result