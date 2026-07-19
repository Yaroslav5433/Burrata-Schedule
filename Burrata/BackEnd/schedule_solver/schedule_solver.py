from ortools.sat.python import cp_model


DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
DAY_BG = ["понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя"]

# Input row format:
# [prev Sat, prev Sun, Mon, Tue, Wed, Thu, Fri, Sat, Sun]
HISTORY_DAYS = 2
TARGET_DAYS = 7
INPUT_DAYS = 9
TARGET_OFFSET = 2

SHIFTS = ["1", "2", "Д", "Д12"]
ASSIGNMENTS = ["X"] + SHIFTS

SHIFT_SET = set(SHIFTS)
SHORT_SHIFTS = {"1", "2"}
LONG_SHIFTS = {"Д", "Д12"}

# V is accepted and normalized to X.
VALID_FIXED = {"V", "X", "1", "2", "Д", "Д12"}

# If True, 3 long shifts in a row are forbidden as a hard constraint.
# This also checks previous Sat/Sun before the new Monday.
FORBID_THREE_CONSECUTIVE_LONG = True


DEFAULT_WEIGHTS = {
    "rest_gap": 10,
    "short_abs": 1,
    "Д": 3,
    "Д12": 2,
    "consecutive_long": 2,

    "long_fair": 0,
    "long_range": 0,
    "second_shift_fair": 0,
}


BALANCED_WEIGHTS = dict(DEFAULT_WEIGHTS)
BALANCED_WEIGHTS.update({
    "short_abs": 5,
    "long_fair": 1,
    "long_range": 20,
    "second_shift_fair": 1,
})


def failed(reason: str):
    return {
        "status": "failed",
        "schedule": None,
        "reason": reason,
    }


def parse_demands(daily_demands):
    if not isinstance(daily_demands, dict):
        raise ValueError(
            "Данните за необходимия брой служители трябва да бъдат подадени по дни."
        )

    result = []

    for i in range(TARGET_DAYS):
        long_key = DAY_LONG[i]
        short_key = DAY_SHORT[i]
        day_name = DAY_BG[i]

        if long_key in daily_demands:
            raw = daily_demands[long_key]
        elif short_key in daily_demands:
            raw = daily_demands[short_key]
        else:
            raise ValueError(
                f"Липсват данни за необходимия брой служители за {day_name}."
            )

        try:
            if isinstance(raw, str):
                parts = raw.replace(" ", "").split("/")

                if len(parts) != 2:
                    raise ValueError

                a = int(parts[0])
                b = int(parts[1])

            elif isinstance(raw, (list, tuple)) and len(raw) == 2:
                a = int(raw[0])
                b = int(raw[1])

            else:
                raise ValueError

        except (ValueError, TypeError):
            raise ValueError(
                f"Невалидни данни за {day_name}: „{raw}“. "
                f"Използвайте формат като „6/5“ или [6, 5]."
            )

        if a < 0 or b < 0:
            raise ValueError(
                f"Броят на служителите за {day_name} не може да бъде отрицателен."
            )

        result.append((a, b))

    return result


def normalize_cell(value):
    if value is None:
        token = ""
    else:
        token = str(value).strip()

    if token == "V":
        return "X"

    if token in {"X", "1", "2", "Д", "Д12"}:
        return token

    return ""


def normalize_matrix(input_matrix):
    """
    Expected row format:
    [
      prev Saturday,
      prev Sunday,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    ]

    V is normalized to X.

    For backward compatibility, if a row has 7 cells,
    two empty history cells are prepended.
    """
    if not isinstance(input_matrix, dict):
        raise ValueError(
            "Графикът трябва да съдържа списък със служители и техните смени."
        )

    if not input_matrix:
        raise ValueError(
            "Не е добавен нито един служител."
        )

    workers = list(input_matrix.keys())
    norm = {}

    for worker in workers:
        row = input_matrix[worker]

        if not isinstance(row, (list, tuple)):
            raise ValueError(
                f"Данните за служител „{worker}“ са в невалиден формат."
            )

        if len(row) == 7:
            row = ["", ""] + list(row)

        elif len(row) != INPUT_DAYS:
            raise ValueError(
                f"За служител „{worker}“ трябва да има точно 9 полета: "
                f"предходна събота, предходна неделя и 7 дни от новата седмица."
            )

        norm[worker] = [
            normalize_cell(value)
            for value in row
        ]

    return workers, norm


def normalize_worker_restrictions(workers, only_short=None, only_long=None):
    """
    only_short:
        Workers who may receive only 1, 2 or X.

    only_long:
        Workers who may receive only Д, Д12 or X.
        The weekly maximum of 3 long shifts is disabled
        for these workers.
    """
    if only_short is None:
        only_short = []

    if only_long is None:
        only_long = []

    if isinstance(only_short, str):
        raise ValueError(
            "Списъкът със служители само за кратки смени е в невалиден формат."
        )

    if isinstance(only_long, str):
        raise ValueError(
            "Списъкът със служители само за дълги смени е в невалиден формат."
        )

    try:
        only_short = set(only_short)
        only_long = set(only_long)
    except TypeError:
        raise ValueError(
            "Списъците с ограничения за служителите са в невалиден формат."
        )

    worker_set = set(workers)

    unknown_short = only_short - worker_set
    if unknown_short:
        names = ", ".join(
            map(str, sorted(unknown_short, key=str))
        )

        raise ValueError(
            f"Следните служители от списъка „само кратки смени“ "
            f"не са намерени в графика: {names}."
        )

    unknown_long = only_long - worker_set
    if unknown_long:
        names = ", ".join(
            map(str, sorted(unknown_long, key=str))
        )

        raise ValueError(
            f"Следните служители от списъка „само дълги смени“ "
            f"не са намерени в графика: {names}."
        )

    overlap = only_short & only_long
    if overlap:
        names = ", ".join(
            map(str, sorted(overlap, key=str))
        )

        raise ValueError(
            f"Следните служители са добавени едновременно в списъците "
            f"„само кратки смени“ и „само дълги смени“: {names}. "
            f"Премахнете ги от единия списък."
        )

    return only_short, only_long


def week_cell(norm, worker, d):
    """
    d: 0..6 for Mon..Sun of the target week.
    """
    return norm[worker][TARGET_OFFSET + d]


def is_no_claim_worker(norm, worker):
    """
    A worker has no preliminary claims if all 7 target-week
    cells are empty strings.

    Previous Sat/Sun are ignored.
    """
    return all(
        week_cell(norm, worker, d) == ""
        for d in range(TARGET_DAYS)
    )


def get_worker_work_slots(norm, worker):
    """
    Workers without preliminary claims receive exactly 2 X,
    so they work exactly 5 days.

    Other workers work on every day that is not fixed X.
    """
    target_cells = [
        week_cell(norm, worker, d)
        for d in range(TARGET_DAYS)
    ]

    if is_no_claim_worker(norm, worker):
        return 5

    return sum(
        1
        for cell in target_cells
        if cell != "X"
    )


def get_worker_long_capacity(norm, worker, only_short, only_long):
    """
    Returns the maximum possible number of long shifts.

    only_short workers cannot receive long shifts.

    only_long workers may receive a long shift on every working day,
    and the normal weekly maximum of 3 is disabled for them.
    """
    if worker in only_short:
        return 0

    if worker in only_long:
        return get_worker_work_slots(norm, worker)

    target_cells = [
        week_cell(norm, worker, d)
        for d in range(TARGET_DAYS)
    ]

    fixed_long = sum(
        1
        for cell in target_cells
        if cell in LONG_SHIFTS
    )

    blank_count = sum(
        1
        for cell in target_cells
        if cell == ""
    )

    return min(3, fixed_long + blank_count)


def validate_fixed_shift_restrictions(
    workers,
    norm,
    only_short,
    only_long,
):
    for worker in workers:
        for d in range(TARGET_DAYS):
            cell = week_cell(norm, worker, d)

            if worker in only_short and cell in LONG_SHIFTS:
                raise ValueError(
                    f"Служител „{worker}“ е отбелязан само за кратки смени, "
                    f"но за {DAY_BG[d]} има зададена дълга смяна „{cell}“."
                )

            if worker in only_long and cell in SHORT_SHIFTS:
                raise ValueError(
                    f"Служител „{worker}“ е отбелязан само за дълги смени, "
                    f"но за {DAY_BG[d]} има зададена кратка смяна „{cell}“."
                )


def Д12_base_threshold(d):
    """
    d: 0..6, Mon..Sun.

    Mon-Fri: 6
    Sat-Sun: 10
    """
    return 6 if d <= 4 else 10


def is_late_shift(cell):
    return cell in {"2", "Д", "Д12"}


def is_early_shift(cell):
    # Preserving original logic: Д12 is not counted as early here.
    return cell in {"1", "Д"}


def is_long_shift(cell):
    return cell in LONG_SHIFTS


def validate_and_score(
    schedule,
    workers,
    norm,
    demand_ab,
    only_short=None,
    only_long=None,
):
    only_short = set(only_short or [])
    only_long = set(only_long or [])

    if set(schedule.keys()) != set(workers):
        return (
            False,
            "Списъкът със служители в създадения график не съответства "
            "на въведения списък.",
            None,
        )

    no_claim_workers = {
        worker: is_no_claim_worker(norm, worker)
        for worker in workers
    }

    # Validate cells, fixed values and shift restrictions.
    for worker in workers:
        if worker not in schedule:
            return (
                False,
                f"Служител „{worker}“ липсва в създадения график.",
                None,
            )

        row = schedule[worker]

        if not isinstance(row, list) or len(row) != TARGET_DAYS:
            return (
                False,
                f"Графикът на служител „{worker}“ трябва да съдържа точно 7 дни.",
                None,
            )

        for d in range(TARGET_DAYS):
            original = week_cell(norm, worker, d)
            final = row[d]

            if original == "X":
                if final != "X":
                    return (
                        False,
                        f"Предварително зададеният почивен ден на служител "
                        f"„{worker}“ за {DAY_BG[d]} е бил променен.",
                        None,
                    )

            elif original in SHIFT_SET:
                if final != original:
                    return (
                        False,
                        f"Предварително зададената смяна на служител "
                        f"„{worker}“ за {DAY_BG[d]} е била променена.",
                        None,
                    )

            else:
                if final == "X":
                    if not no_claim_workers[worker]:
                        return (
                            False,
                            f"На служител „{worker}“ е добавен почивен ден "
                            f"за {DAY_BG[d]}, въпреки че служителят има "
                            f"предварително зададени желания.",
                            None,
                        )

                elif final not in SHIFT_SET:
                    return (
                        False,
                        f"За служител „{worker}“ е избрана невалидна смяна "
                        f"за {DAY_BG[d]}: „{final}“.",
                        None,
                    )

            if worker in only_short and final in LONG_SHIFTS:
                return (
                    False,
                    f"Служител „{worker}“ може да работи само кратки смени, "
                    f"но за {DAY_BG[d]} е получил смяна „{final}“.",
                    None,
                )

            if worker in only_long and final in SHORT_SHIFTS:
                return (
                    False,
                    f"Служител „{worker}“ може да работи само дълги смени, "
                    f"но за {DAY_BG[d]} е получил смяна „{final}“.",
                    None,
                )

        if no_claim_workers[worker]:
            x_count = sum(
                1
                for cell in row
                if cell == "X"
            )

            if x_count != 2:
                return (
                    False,
                    f"Служител „{worker}“ няма предварително зададени желания "
                    f"и трябва да има точно 2 почивни дни, но има {x_count}.",
                    None,
                )

    # Validate coverage and Д12 eligibility.
    for d in range(TARGET_DAYS):
        A, B = demand_ab[d]

        morning = 0
        evening = 0
        has_Д12 = False
        Д12_base = 0

        for worker in workers:
            cell = schedule[worker][d]

            if cell in {"1", "Д", "Д12"}:
                morning += 1

            if cell in {"2", "Д", "Д12"}:
                evening += 1

            if cell == "Д12":
                has_Д12 = True

            if cell in {"1", "Д"}:
                Д12_base += 1

        if morning != A or evening != B:
            return (
                False,
                f"За {DAY_BG[d]} са разпределени {morning} служители "
                f"за първата част и {evening} за втората част, "
                f"вместо необходимите {A}/{B}.",
                None,
            )

        threshold = Д12_base_threshold(d)

        if has_Д12 and Д12_base < threshold:
            return (
                False,
                f"За {DAY_BG[d]} не могат да бъдат използвани смени „Д12“, "
                f"защото няма достатъчно служители на смени „1“ и „Д“.",
                None,
            )

    # Weekly long-shift limit.
    # Disabled for only_long workers.
    for worker in workers:
        if worker in only_long:
            continue

        long_count = sum(
            1
            for cell in schedule[worker]
            if cell in LONG_SHIFTS
        )

        if long_count > 3:
            return (
                False,
                f"Служител „{worker}“ има {long_count} дълги смени. "
                f"Разрешени са най-много 3.",
                None,
            )

    # No 3 consecutive long shifts, including previous Sat/Sun.
    if FORBID_THREE_CONSECUTIVE_LONG:
        for worker in workers:
            combined = [
                norm[worker][0],
                norm[worker][1],
            ] + schedule[worker]

            for end_pos in range(2, 9):
                if (
                    combined[end_pos - 2] in LONG_SHIFTS
                    and combined[end_pos - 1] in LONG_SHIFTS
                    and combined[end_pos] in LONG_SHIFTS
                ):
                    return (
                        False,
                        f"Служител „{worker}“ има три последователни "
                        f"дълги смени, което не е разрешено.",
                        None,
                    )

    # Recalculate score.
    score = 0

    for worker in workers:
        row = schedule[worker]
        combined = [
            norm[worker][0],
            norm[worker][1],
        ] + row

        # P1 — rest-gap penalty.
        for pos in range(1, 8):
            today = combined[pos]
            tomorrow = combined[pos + 1]

            if is_late_shift(today) and is_early_shift(tomorrow):
                score += 10

        # P2 — short-shift balance.
        n1 = sum(1 for cell in row if cell == "1")
        n2 = sum(1 for cell in row if cell == "2")
        score += abs(n1 - n2)

        # P3 — long-shift usage.
        for cell in row:
            if cell == "Д":
                score += 3
            elif cell == "Д12":
                score += 2

        # P4 — consecutive long-shift overload.
        for end_pos in range(2, 9):
            if (
                combined[end_pos - 2] in LONG_SHIFTS
                and combined[end_pos - 1] in LONG_SHIFTS
                and combined[end_pos] in LONG_SHIFTS
            ):
                score += 2

    return True, None, score


def solve_schedule(
    input_matrix,
    daily_demands,
    time_limit_seconds=30,
    num_search_workers=8,
    weight_overrides=None,
    require_optimal=False,
    only_short=None,
    only_long=None,
):
    try:
        weights = dict(DEFAULT_WEIGHTS)

        if weight_overrides:
            weights.update(weight_overrides)

        weights = {
            key: int(value)
            for key, value in weights.items()
        }

    except (TypeError, ValueError):
        return failed(
            "Настройките за създаване на графика са невалидни."
        )

    try:
        demand_ab = parse_demands(daily_demands)
        workers, norm = normalize_matrix(input_matrix)

        only_short, only_long = normalize_worker_restrictions(
            workers=workers,
            only_short=only_short,
            only_long=only_long,
        )

        validate_fixed_shift_restrictions(
            workers=workers,
            norm=norm,
            only_short=only_short,
            only_long=only_long,
        )

    except ValueError as exc:
        return failed(str(exc))

    except Exception:
        return failed(
            "Въведените данни не могат да бъдат обработени. "
            "Проверете графика и опитайте отново."
        )

    no_claim_by_worker = {
        worker: is_no_claim_worker(norm, worker)
        for worker in workers
    }

    total_demand_units = sum(
        A + B
        for A, B in demand_ab
    )

    total_morning = sum(
        A
        for A, _ in demand_ab
    )

    total_evening = sum(
        B
        for _, B in demand_ab
    )

    total_work_slots = 0
    total_minimum_long = 0
    total_long_capacity = 0
    long_capacity_by_worker = {}

    for worker in workers:
        target_cells = [
            week_cell(norm, worker, d)
            for d in range(TARGET_DAYS)
        ]

        fixed_long = sum(
            1
            for cell in target_cells
            if cell in LONG_SHIFTS
        )

        if worker not in only_long and fixed_long > 3:
            return failed(
                f"За служител „{worker}“ са зададени {fixed_long} дълги смени. "
                f"Разрешени са най-много 3 дълги смени за седмицата."
            )

        worker_work_slots = get_worker_work_slots(
            norm,
            worker,
        )

        worker_long_capacity = get_worker_long_capacity(
            norm=norm,
            worker=worker,
            only_short=only_short,
            only_long=only_long,
        )

        if worker in only_long:
            minimum_long = worker_work_slots
        else:
            minimum_long = fixed_long

        total_work_slots += worker_work_slots
        total_minimum_long += minimum_long
        total_long_capacity += worker_long_capacity

        long_capacity_by_worker[worker] = worker_long_capacity

    total_required_long = (
        total_demand_units - total_work_slots
    )

    if total_required_long < 0:
        return failed(
            f"Има повече задължителни работни дни ({total_work_slots}), "
            f"отколкото могат да бъдат покрити според зададените нужди "
            f"({total_demand_units} позиции). "
            f"Проверете фиксираните почивни дни и необходимия брой служители."
        )

    if total_required_long > min(total_morning, total_evening):
        return failed(
            f"За покриване на графика са необходими {total_required_long} "
            f"дълги смени, но зададените нужди позволяват най-много "
            f"{min(total_morning, total_evening)}. "
            f"Проверете необходимия брой служители за първа и втора смяна."
        )

    if total_minimum_long > total_required_long:
        return failed(
            f"Зададени са поне {total_minimum_long} задължителни дълги смени, "
            f"но според нуждите на графика могат да бъдат използвани само "
            f"{total_required_long}. "
            f"Проверете фиксираните дълги смени и списъка "
            f"„само дълги смени“."
        )

    if total_long_capacity < total_required_long:
        return failed(
            f"Няма достатъчно възможности за разпределяне на дългите смени. "
            f"Необходими са {total_required_long}, но могат да бъдат "
            f"разпределени най-много {total_long_capacity}. "
            f"Добавете служители за дълги смени или променете ограниченията."
        )

    model = cp_model.CpModel()

    worker_indices = range(len(workers))
    day_indices = range(TARGET_DAYS)

    x = {}

    # x[worker_index, target_day, assignment]
    for wi in worker_indices:
        worker = workers[wi]
        no_claim = no_claim_by_worker[worker]

        for d in day_indices:
            original = week_cell(norm, worker, d)

            for shift in ASSIGNMENTS:
                x[(wi, d, shift)] = model.NewBoolVar(
                    f"x_{wi}_{d}_{shift}"
                )

            model.Add(
                sum(
                    x[(wi, d, shift)]
                    for shift in ASSIGNMENTS
                ) == 1
            )

            if original == "X":
                for shift in ASSIGNMENTS:
                    model.Add(
                        x[(wi, d, shift)]
                        == (1 if shift == "X" else 0)
                    )

            elif original in SHIFT_SET:
                for shift in ASSIGNMENTS:
                    model.Add(
                        x[(wi, d, shift)]
                        == (1 if shift == original else 0)
                    )

            else:
                if not no_claim:
                    model.Add(
                        x[(wi, d, "X")] == 0
                    )

            # Workers from only_short may receive only 1, 2 or X.
            if worker in only_short:
                model.Add(x[(wi, d, "Д")] == 0)
                model.Add(x[(wi, d, "Д12")] == 0)

            # Workers from only_long may receive only Д, Д12 or X.
            if worker in only_long:
                model.Add(x[(wi, d, "1")] == 0)
                model.Add(x[(wi, d, "2")] == 0)

        if no_claim:
            model.Add(
                sum(
                    x[(wi, d, "X")]
                    for d in day_indices
                ) == 2
            )

    def xv(wi, d, shift):
        return x.get((wi, d, shift), 0)

    # Exact daily coverage.
    for d in day_indices:
        A, B = demand_ab[d]

        model.Add(
            sum(
                xv(wi, d, "1")
                + xv(wi, d, "Д")
                + xv(wi, d, "Д12")
                for wi in worker_indices
            ) == A
        )

        model.Add(
            sum(
                xv(wi, d, "2")
                + xv(wi, d, "Д")
                + xv(wi, d, "Д12")
                for wi in worker_indices
            ) == B
        )

    # Worker-level count variables.
    n1_count = {}
    n2_count = {}
    long_count = {}

    for wi in worker_indices:
        worker = workers[wi]

        n1 = model.NewIntVar(
            0,
            TARGET_DAYS,
            f"n1_{wi}",
        )

        n2 = model.NewIntVar(
            0,
            TARGET_DAYS,
            f"n2_{wi}",
        )

        # only_long workers are not limited to 3 long shifts.
        max_long = (
            TARGET_DAYS
            if worker in only_long
            else 3
        )

        lng = model.NewIntVar(
            0,
            max_long,
            f"long_{wi}",
        )

        model.Add(
            n1 == sum(
                xv(wi, d, "1")
                for d in day_indices
            )
        )

        model.Add(
            n2 == sum(
                xv(wi, d, "2")
                for d in day_indices
            )
        )

        model.Add(
            lng == sum(
                xv(wi, d, "Д")
                + xv(wi, d, "Д12")
                for d in day_indices
            )
        )

        if worker not in only_long:
            model.Add(lng <= 3)

        n1_count[wi] = n1
        n2_count[wi] = n2
        long_count[wi] = lng

    # Д12 eligibility.
    for d in day_indices:
        threshold = Д12_base_threshold(d)

        Д12_base = sum(
            xv(wi, d, "1")
            + xv(wi, d, "Д")
            for wi in worker_indices
        )

        for wi in worker_indices:
            model.Add(
                Д12_base >= threshold
            ).OnlyEnforceIf(
                x[(wi, d, "Д12")]
            )

    def combined_long_expr(wi, combined_pos):
        """
        combined_pos:
        0 = previous Saturday
        1 = previous Sunday
        2 = target Monday
        ...
        8 = target Sunday
        """
        worker = workers[wi]

        if combined_pos < TARGET_OFFSET:
            return (
                1
                if norm[worker][combined_pos] in LONG_SHIFTS
                else 0
            )

        d = combined_pos - TARGET_OFFSET

        return (
            xv(wi, d, "Д")
            + xv(wi, d, "Д12")
        )

    # Hard rule: no 3 consecutive long shifts,
    # including previous Sat/Sun.
    if FORBID_THREE_CONSECUTIVE_LONG:
        for wi in worker_indices:
            for end_pos in range(2, 9):
                l0 = combined_long_expr(wi, end_pos - 2)
                l1 = combined_long_expr(wi, end_pos - 1)
                l2 = combined_long_expr(wi, end_pos)

                model.Add(
                    l0 + l1 + l2 <= 2
                )

    objective_terms = []

    # P1 — rest-gap penalty.
    if weights["rest_gap"]:
        for wi in worker_indices:
            worker = workers[wi]

            # Previous Sunday -> target Monday.
            if is_late_shift(norm[worker][1]):
                monday_early = (
                    xv(wi, 0, "1")
                    + xv(wi, 0, "Д")
                )

                objective_terms.append(
                    weights["rest_gap"] * monday_early
                )

            # Target-week transitions.
            for d in range(6):
                today_late = (
                    xv(wi, d, "2")
                    + xv(wi, d, "Д")
                    + xv(wi, d, "Д12")
                )

                tomorrow_early = (
                    xv(wi, d + 1, "1")
                    + xv(wi, d + 1, "Д")
                )

                gap = model.NewBoolVar(
                    f"rest_gap_{wi}_{d}"
                )

                model.Add(gap <= today_late)
                model.Add(gap <= tomorrow_early)
                model.Add(
                    gap >= today_late + tomorrow_early - 1
                )

                objective_terms.append(
                    weights["rest_gap"] * gap
                )

    # P2 — short-shift balance.
    if weights["short_abs"]:
        for wi in worker_indices:
            diff = model.NewIntVar(
                -TARGET_DAYS,
                TARGET_DAYS,
                f"short_diff_{wi}",
            )

            abs_diff = model.NewIntVar(
                0,
                TARGET_DAYS,
                f"short_abs_{wi}",
            )

            model.Add(
                diff == n1_count[wi] - n2_count[wi]
            )

            model.AddAbsEquality(
                abs_diff,
                diff,
            )

            objective_terms.append(
                weights["short_abs"] * abs_diff
            )

    # P3 — long-shift usage.
    if weights["Д"]:
        for key, var in x.items():
            wi, d, shift = key

            if shift == "Д":
                objective_terms.append(
                    weights["Д"] * var
                )

    if weights["Д12"]:
        for key, var in x.items():
            wi, d, shift = key

            if shift == "Д12":
                objective_terms.append(
                    weights["Д12"] * var
                )

    # P4 — consecutive long-shift overload.
    if weights["consecutive_long"]:
        for wi in worker_indices:
            for end_pos in range(2, 9):
                l0 = combined_long_expr(wi, end_pos - 2)
                l1 = combined_long_expr(wi, end_pos - 1)
                l2 = combined_long_expr(wi, end_pos)

                overload = model.NewBoolVar(
                    f"long_overload_{wi}_{end_pos}"
                )

                model.Add(overload <= l0)
                model.Add(overload <= l1)
                model.Add(overload <= l2)
                model.Add(
                    overload >= l0 + l1 + l2 - 2
                )

                objective_terms.append(
                    weights["consecutive_long"] * overload
                )

    # Optional fairness: distribute long shifts proportionally.
    if weights["long_fair"]:
        long_caps = {
            wi: long_capacity_by_worker[workers[wi]]
            for wi in worker_indices
        }

        denominator = sum(
            cap
            for cap in long_caps.values()
            if cap > 0
        )

        total_long = total_required_long

        if total_long > 0 and denominator > 0:
            for wi in worker_indices:
                cap = long_caps[wi]

                if cap == 0:
                    continue

                target_scaled = total_long * cap

                max_abs = max(
                    abs(target_scaled),
                    abs(
                        denominator * cap
                        - target_scaled
                    ),
                )

                diff = model.NewIntVar(
                    -max_abs,
                    max_abs,
                    f"long_fair_diff_{wi}",
                )

                abs_dev = model.NewIntVar(
                    0,
                    max_abs,
                    f"long_fair_abs_{wi}",
                )

                model.Add(
                    diff
                    == denominator * long_count[wi]
                    - target_scaled
                )

                model.AddAbsEquality(
                    abs_dev,
                    diff,
                )

                objective_terms.append(
                    weights["long_fair"] * abs_dev
                )

    # Optional fairness: minimize long-shift range
    # among normal comparable workers.
    if weights["long_range"]:
        comparable_workers = []

        for wi in worker_indices:
            worker = workers[wi]

            if worker in only_short or worker in only_long:
                continue

            if long_capacity_by_worker[worker] == 3:
                comparable_workers.append(wi)

        if len(comparable_workers) >= 2:
            max_long = model.NewIntVar(
                0,
                3,
                "max_long_comparable",
            )

            min_long = model.NewIntVar(
                0,
                3,
                "min_long_comparable",
            )

            model.AddMaxEquality(
                max_long,
                [
                    long_count[wi]
                    for wi in comparable_workers
                ],
            )

            model.AddMinEquality(
                min_long,
                [
                    long_count[wi]
                    for wi in comparable_workers
                ],
            )

            objective_terms.append(
                weights["long_range"]
                * (max_long - min_long)
            )

    # Optional fairness: distribute second shifts proportionally.
    if weights["second_shift_fair"]:
        total_short_1 = (
            total_morning - total_required_long
        )

        total_short_2 = (
            total_evening - total_required_long
        )

        total_short = (
            total_short_1 + total_short_2
        )

        if total_short > 0:
            for wi in worker_indices:
                short_count = model.NewIntVar(
                    0,
                    TARGET_DAYS,
                    f"short_total_{wi}",
                )

                model.Add(
                    short_count
                    == n1_count[wi] + n2_count[wi]
                )

                max_abs = (
                    TARGET_DAYS
                    * max(total_short, total_short_2)
                )

                diff = model.NewIntVar(
                    -max_abs,
                    max_abs,
                    f"second_fair_diff_{wi}",
                )

                abs_dev = model.NewIntVar(
                    0,
                    max_abs,
                    f"second_fair_abs_{wi}",
                )

                model.Add(
                    diff
                    == total_short * n2_count[wi]
                    - total_short_2 * short_count
                )

                model.AddAbsEquality(
                    abs_dev,
                    diff,
                )

                objective_terms.append(
                    weights["second_shift_fair"] * abs_dev
                )

    if objective_terms:
        model.Minimize(
            sum(objective_terms)
        )
    else:
        model.Minimize(0)

    solver = cp_model.CpSolver()

    try:
        solver.parameters.max_time_in_seconds = float(
            time_limit_seconds
        )

        solver.parameters.num_search_workers = int(
            num_search_workers
        )

        solver.parameters.random_seed = 123

    except (TypeError, ValueError):
        return failed(
            "Времето за изчисление или броят на използваните процеси "
            "са зададени неправилно."
        )

    try:
        status = solver.Solve(model)

    except Exception:
        return failed(
            "Възникна техническа грешка при създаването на графика. "
            "Проверете въведените данни и опитайте отново."
        )

    if status == cp_model.INFEASIBLE:
        return failed(
            "Не може да бъде съставен график с въведените условия. "
            "Проверете необходимия брой служители за всеки ден, "
            "фиксираните смени, почивните дни и ограниченията "
            "„само кратки“ или „само дълги смени“."
        )

    if status == cp_model.UNKNOWN:
        return failed(
            f"Не беше намерен график в рамките на "
            f"{time_limit_seconds} секунди. "
            f"Опитайте отново или увеличете времето за изчисление."
        )

    if status == cp_model.MODEL_INVALID:
        return failed(
            "Някои от въведените данни или ограничения са невалидни. "
            "Проверете графика, нуждите за всеки ден и списъците "
            "с ограничения за служителите."
        )

    if status not in (
        cp_model.OPTIMAL,
        cp_model.FEASIBLE,
    ):
        return failed(
            "Графикът не можа да бъде създаден. "
            "Проверете въведените условия и опитайте отново."
        )

    if require_optimal and status != cp_model.OPTIMAL:
        return failed(
            "Намерен е възможен график, но системата не успя да потвърди, "
            "че това е най-добрият вариант в рамките на зададеното време. "
            "Увеличете времето за изчисление и опитайте отново."
        )

    # Extract target-week schedule only: Mon..Sun.
    output_schedule = {}

    for wi in worker_indices:
        worker = workers[wi]
        row = []

        for d in day_indices:
            chosen = None

            for shift in ASSIGNMENTS:
                if solver.Value(x[(wi, d, shift)]) == 1:
                    chosen = shift
                    break

            if chosen is None:
                return failed(
                    f"Не беше избрана смяна за служител „{worker}“ "
                    f"за {DAY_BG[d]}. "
                    f"Проверете условията и опитайте отново."
                )

            row.append(chosen)

        output_schedule[worker] = row

    valid, reason, score = validate_and_score(
        schedule=output_schedule,
        workers=workers,
        norm=norm,
        demand_ab=demand_ab,
        only_short=only_short,
        only_long=only_long,
    )

    if not valid:
        return failed(
            "Създаденият график не премина окончателната проверка. "
            "Проверете въведените условия и опитайте отново."
        )

    return {
        "status": "success",
        "schedule": output_schedule,
        "reason": None,
    }


def calculate_schedule(
    claims,
    demands,
    only_short=None,
    only_long=None,
):
    return solve_schedule(
        input_matrix=claims,
        daily_demands=demands,
        time_limit_seconds=30,
        num_search_workers=8,
        weight_overrides=BALANCED_WEIGHTS,
        require_optimal=False,
        only_short=only_short,
        only_long=only_long,
    )