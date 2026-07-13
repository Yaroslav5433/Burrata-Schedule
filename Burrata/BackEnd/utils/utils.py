from datetime import datetime, date, timedelta
from .constants import basic_shifts_insert, basic_total_insert
from loguru import logger


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

def vacations_to_week(vacations: list[dict], dates: list):
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


def get_weekday_from_date(date_str, vacations: bool = False):
    current_year = datetime.now().year
    if vacations:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    else:
         date = datetime.strptime(f"{date_str}.{current_year}", "%d.%m.%Y")
    return date.strftime("%A")


def calculate_limits(
    all_users: int,
    default_shifts: dict,
    all_claims: dict,
    all_vacations: dict,
):
    
    coefficients = [1, 1, 0.9, 0.8, 0.7, 0.6, 0.6]

    result = {}

    days = list(default_shifts.keys())

    limits = {}

    for index, (day, shifts) in enumerate(default_shifts.items()):
        first, second = map(int, shifts.split("/"))

        max_days_off = all_users - max(first, second)

        limits[day] = round(
            max_days_off * coefficients[index]
        )

    claims_count = {day: 0 for day in days}

    logger.info(limits)

    for user_claims in all_claims.values():
        for date in user_claims:
            day = get_weekday_from_date(date)

            if day in claims_count:
                claims_count[day] += 1

    for user_vacations in all_vacations.values():
        for date in user_vacations:
            day = get_weekday_from_date(date, vacations = True)

            if day in claims_count:
                claims_count[day] += 1

    for day in days:
        result[day] = claims_count[day] <= limits[day]

    return result
    

def vacation_to_dict(vacations: list[dict]):
    dict_vacations = {}

    for vacation in vacations:
        username = vacation["username"]
        start_date = vacation["start_date"].date()
        end_date = vacation["end_date"].date()

        if username not in dict_vacations:
            dict_vacations[username] = {}

        current_date = start_date

        while current_date <= end_date:
            dict_vacations[username][str(current_date)] = "X"
            current_date += timedelta(days=1)

    return dict_vacations