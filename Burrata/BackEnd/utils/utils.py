from datetime import datetime, date, timedelta

def dateToSql(values):
    current_year = datetime.now().year

    newValues = {}

    for key, value in values.items():
        day_str, month_str = key.split(".")
        day = int(day_str)
        month = int(month_str)

        date_obj = datetime(current_year, month, day).date()

        newValues[date_obj] = value

    return newValues

def sqlToNormal(values):
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

def currentWeekDates(nosql = False):
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    this_week = [start_of_week + timedelta(days=i) for i in range(7)]
    if nosql:
        this_week = [
        (start_of_week + timedelta(days=i)).strftime("%d.%m")
        for i in range(7)
        ]
    return this_week


