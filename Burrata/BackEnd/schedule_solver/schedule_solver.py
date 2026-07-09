from ortools.sat.python import cp_model


DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Input row format:
# [prev Sat, prev Sun, Mon, Tue, Wed, Thu, Fri, Sat, Sun]
HISTORY_DAYS = 2
TARGET_DAYS = 7
INPUT_DAYS = 9
TARGET_OFFSET = 2

SHIFTS = ["1", "2", "Д", "Д12"]
ASSIGNMENTS = ["X"] + SHIFTS

SHIFT_SET = set(SHIFTS)
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
    result = []

    for i in range(7):
        long_key = DAY_LONG[i]
        short_key = DAY_SHORT[i]

        if long_key in daily_demands:
            raw = daily_demands[long_key]
        elif short_key in daily_demands:
            raw = daily_demands[short_key]
        else:
            raise ValueError(f"Missing demand for {long_key}")

        if isinstance(raw, str):
            parts = raw.replace(" ", "").split("/")
            if len(parts) != 2:
                raise ValueError(f"Invalid demand format for {long_key}: {raw}")
            a = int(parts[0])
            b = int(parts[1])
        elif isinstance(raw, (list, tuple)) and len(raw) == 2:
            a = int(raw[0])
            b = int(raw[1])
        else:
            raise ValueError(f"Invalid demand format for {long_key}: {raw}")

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
    New expected row format:
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

    For backward compatibility, if row has 7 cells, two empty history cells are prepended.
    If you want strict 9-cell input only, remove the len(row) == 7 branch.
    """
    if not isinstance(input_matrix, dict):
        raise ValueError("Input schedule matrix must be a dictionary")

    workers = list(input_matrix.keys())
    norm = {}

    for worker in workers:
        row = input_matrix[worker]

        if not isinstance(row, (list, tuple)):
            raise ValueError(f"Worker {worker} row must be a list or tuple")

        if len(row) == 7:
            row = ["", ""] + list(row)
        elif len(row) != 9:
            raise ValueError(
                f"Worker {worker} must have exactly 9 cells: "
                f"[prev Sat, prev Sun, Mon, Tue, Wed, Thu, Fri, Sat, Sun]"
            )

        normalized_row = [normalize_cell(value) for value in row]
        norm[worker] = normalized_row

    return workers, norm


def week_cell(norm, worker, d):
    """
    d: 0..6 for Mon..Sun of the target week.
    """
    return norm[worker][TARGET_OFFSET + d]


def is_no_claim_worker(norm, worker):
    """
    A worker has no preliminary claims if all 7 target-week cells are empty strings.
    Previous Sat/Sun are ignored.
    """
    return all(week_cell(norm, worker, d) == "" for d in range(TARGET_DAYS))


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


def validate_and_score(schedule, workers, norm, demand_ab):
    if set(schedule.keys()) != set(workers):
        return False, "Output workers do not match input workers exactly", None

    no_claim_workers = {
        w: is_no_claim_worker(norm, w)
        for w in workers
    }

    # Validate cells and fixed values.
    for w in workers:
        if w not in schedule:
            return False, f"Missing worker in output: {w}", None

        row = schedule[w]

        # Output is still only the target week: Mon..Sun.
        if not isinstance(row, list) or len(row) != 7:
            return False, f"Worker {w} output row must contain exactly 7 target-week cells", None

        for d in range(7):
            original = week_cell(norm, w, d)
            final = row[d]

            if original == "X":
                if final != "X":
                    return False, f"Fixed X changed for {w} on {DAY_SHORT[d]}", None

            elif original in SHIFT_SET:
                if final != original:
                    return False, f"Fixed shift changed for {w} on {DAY_SHORT[d]}", None

            else:
                # Original target cell was empty.
                if final == "X":
                    if not no_claim_workers[w]:
                        return False, (
                            f"{w} received X on {DAY_SHORT[d]}, "
                            f"but only workers with fully empty target-week claims may receive dynamic X"
                        ), None
                elif final not in SHIFT_SET:
                    return False, f"Invalid shift for {w} on {DAY_SHORT[d]}: {final}", None

        # New rule: no-claim workers must have exactly 2 X in the target week.
        if no_claim_workers[w]:
            x_count = sum(1 for cell in row if cell == "X")
            if x_count != 2:
                return False, (
                    f"{w} has no preliminary claims and must have exactly 2 X days, "
                    f"but got {x_count}"
                ), None

    # Validate coverage and Д12 eligibility.
    for d in range(7):
        A, B = demand_ab[d]

        morning = 0
        evening = 0
        has_Д12 = False
        Д12_base = 0  # count(1) + count(Д)

        for w in workers:
            cell = schedule[w][d]

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
                f"{DAY_LONG[d]} coverage mismatch: got {morning}/{evening}, required {A}/{B}",
                None,
            )

        threshold = Д12_base_threshold(d)
        if has_Д12 and Д12_base < threshold:
            return (
                False,
                f"{DAY_LONG[d]} violates Д12 eligibility: "
                f"count(1)+count(Д) = {Д12_base} < {threshold}",
                None,
            )

    # Validate weekly long-shift limit for the target week only.
    for w in workers:
        long_count = sum(1 for cell in schedule[w] if cell in LONG_SHIFTS)

        if long_count > 3:
            return False, f"{w} has {long_count} long shifts, max allowed is 3", None

    # Hard validation: no 3 consecutive long shifts, including previous Sat/Sun.
    if FORBID_THREE_CONSECUTIVE_LONG:
        for w in workers:
            combined = [
                norm[w][0],  # previous Saturday
                norm[w][1],  # previous Sunday
            ] + schedule[w]

            for end_pos in range(2, 9):
                if (
                    combined[end_pos - 2] in LONG_SHIFTS
                    and combined[end_pos - 1] in LONG_SHIFTS
                    and combined[end_pos] in LONG_SHIFTS
                ):
                    return False, (
                        f"{w} has 3 consecutive long shifts ending at combined index {end_pos}. "
                        f"Previous Sat/Sun are included in this check."
                    ), None

    # Recalculate score.
    score = 0

    for w in workers:
        row = schedule[w]
        combined = [norm[w][0], norm[w][1]] + row

        # P1 — rest-gap penalty.
        # Includes previous Sunday -> Monday and target-week transitions.
        for pos in range(1, 8):
            today = combined[pos]
            tomorrow = combined[pos + 1]

            if is_late_shift(today) and is_early_shift(tomorrow):
                score += 10

        # P2 — short-shift balance, target week only.
        n1 = sum(1 for cell in row if cell == "1")
        n2 = sum(1 for cell in row if cell == "2")
        score += abs(n1 - n2)

        # P3 — long-shift usage, target week only.
        for cell in row:
            if cell == "Д":
                score += 3
            elif cell == "Д12":
                score += 2

        # P4 — consecutive long-shift overload.
        # Includes previous Sat/Sun.
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
):
    weights = dict(DEFAULT_WEIGHTS)
    if weight_overrides:
        weights.update(weight_overrides)

    weights = {k: int(v) for k, v in weights.items()}

    try:
        demand_ab = parse_demands(daily_demands)
        workers, norm = normalize_matrix(input_matrix)
    except Exception as e:
        return failed(str(e))

    no_claim_by_worker = {
        w: is_no_claim_worker(norm, w)
        for w in workers
    }

    # Precheck weekly long count feasibility.
    total_demand_units = sum(A + B for A, B in demand_ab)
    total_morning = sum(A for A, _ in demand_ab)
    total_evening = sum(B for _, B in demand_ab)

    total_work_slots = 0
    total_fixed_long = 0
    total_long_capacity = 0

    for w in workers:
        target_cells = [week_cell(norm, w, d) for d in range(7)]

        fixed_long = sum(1 for cell in target_cells if cell in LONG_SHIFTS)
        blank_count = sum(1 for cell in target_cells if cell == "")

        if fixed_long > 3:
            return failed(f"{w} has {fixed_long} fixed long shifts, max allowed is 3")

        total_fixed_long += fixed_long

        if no_claim_by_worker[w]:
            # All 7 target cells are blank and exactly 2 X will be assigned.
            total_work_slots += 5
        else:
            # Existing fixed X/V are off. All other target cells must work.
            total_work_slots += sum(1 for cell in target_cells if cell != "X")

        # Max possible long shifts for the worker in the target week.
        total_long_capacity += min(3, fixed_long + blank_count)

    total_required_long = total_demand_units - total_work_slots

    if total_required_long < 0:
        return failed(
            f"Too many working slots after X rules: demand units = {total_demand_units}, "
            f"work slots = {total_work_slots}, required long shifts would be {total_required_long}"
        )

    if total_required_long > min(total_morning, total_evening):
        return failed(
            f"Too many required long shifts globally: required {total_required_long}, "
            f"but morning/evening totals are {total_morning}/{total_evening}"
        )

    if total_fixed_long > total_required_long:
        return failed(
            f"Too many fixed long shifts: fixed {total_fixed_long}, "
            f"but only {total_required_long} long shifts are required by weekly totals"
        )

    if total_long_capacity < total_required_long:
        return failed(
            f"Not enough weekly long-shift capacity: required {total_required_long}, "
            f"capacity {total_long_capacity}"
        )

    model = cp_model.CpModel()

    worker_indices = range(len(workers))
    day_indices = range(7)

    x = {}

    # x[worker_index, target_day, assignment]
    # assignment is one of: X, 1, 2, Д, Д12.
    for wi in worker_indices:
        w = workers[wi]
        no_claim = no_claim_by_worker[w]

        for d in day_indices:
            original = week_cell(norm, w, d)

            for s in ASSIGNMENTS:
                x[(wi, d, s)] = model.NewBoolVar(f"x_{wi}_{d}_{s}")

            model.Add(sum(x[(wi, d, s)] for s in ASSIGNMENTS) == 1)

            if original == "X":
                for s in ASSIGNMENTS:
                    model.Add(x[(wi, d, s)] == (1 if s == "X" else 0))

            elif original in SHIFT_SET:
                for s in ASSIGNMENTS:
                    model.Add(x[(wi, d, s)] == (1 if s == original else 0))

            else:
                # Empty target cell.
                if not no_claim:
                    # For workers with at least one preliminary claim,
                    # empty cells are still working days, as in the old logic.
                    model.Add(x[(wi, d, "X")] == 0)

                # For no-claim workers, X is allowed and exactly 2 X will be enforced below.

        if no_claim:
            model.Add(sum(x[(wi, d, "X")] for d in day_indices) == 2)

    def xv(wi, d, s):
        return x.get((wi, d, s), 0)

    # Exact daily coverage.
    for d in day_indices:
        A, B = demand_ab[d]

        model.Add(
            sum(
                xv(wi, d, "1") + xv(wi, d, "Д") + xv(wi, d, "Д12")
                for wi in worker_indices
            )
            == A
        )

        model.Add(
            sum(
                xv(wi, d, "2") + xv(wi, d, "Д") + xv(wi, d, "Д12")
                for wi in worker_indices
            )
            == B
        )

    # Worker-level count variables.
    n1_count = {}
    n2_count = {}
    long_count = {}

    for wi in worker_indices:
        n1 = model.NewIntVar(0, 7, f"n1_{wi}")
        n2 = model.NewIntVar(0, 7, f"n2_{wi}")
        lng = model.NewIntVar(0, 3, f"long_{wi}")

        model.Add(n1 == sum(xv(wi, d, "1") for d in day_indices))
        model.Add(n2 == sum(xv(wi, d, "2") for d in day_indices))
        model.Add(
            lng
            == sum(
                xv(wi, d, "Д") + xv(wi, d, "Д12")
                for d in day_indices
            )
        )

        model.Add(lng <= 3)

        n1_count[wi] = n1
        n2_count[wi] = n2
        long_count[wi] = lng

    # Д12 eligibility.
    for d in day_indices:
        threshold = Д12_base_threshold(d)

        Д12_base = sum(
            xv(wi, d, "1") + xv(wi, d, "Д")
            for wi in worker_indices
        )

        for wi in worker_indices:
            model.Add(Д12_base >= threshold).OnlyEnforceIf(x[(wi, d, "Д12")])

    def combined_long_expr(wi, combined_pos):
        """
        combined_pos:
        0 = previous Saturday
        1 = previous Sunday
        2 = target Monday
        ...
        8 = target Sunday
        """
        w = workers[wi]

        if combined_pos < TARGET_OFFSET:
            return 1 if norm[w][combined_pos] in LONG_SHIFTS else 0

        d = combined_pos - TARGET_OFFSET
        return xv(wi, d, "Д") + xv(wi, d, "Д12")

    # Hard rule: no 3 consecutive long shifts, including previous Sat/Sun.
    if FORBID_THREE_CONSECUTIVE_LONG:
        for wi in worker_indices:
            for end_pos in range(2, 9):
                l0 = combined_long_expr(wi, end_pos - 2)
                l1 = combined_long_expr(wi, end_pos - 1)
                l2 = combined_long_expr(wi, end_pos)

                model.Add(l0 + l1 + l2 <= 2)

    objective_terms = []

    # P1 — rest-gap penalty.
    if weights["rest_gap"]:
        for wi in worker_indices:
            w = workers[wi]

            # Previous Sunday -> target Monday.
            if is_late_shift(norm[w][1]):
                monday_early = xv(wi, 0, "1") + xv(wi, 0, "Д")
                objective_terms.append(weights["rest_gap"] * monday_early)

            # Target week transitions.
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

                gap = model.NewBoolVar(f"rest_gap_{wi}_{d}")

                model.Add(gap <= today_late)
                model.Add(gap <= tomorrow_early)
                model.Add(gap >= today_late + tomorrow_early - 1)

                objective_terms.append(weights["rest_gap"] * gap)

    # P2 — short-shift balance.
    if weights["short_abs"]:
        for wi in worker_indices:
            diff = model.NewIntVar(-7, 7, f"short_diff_{wi}")
            abs_diff = model.NewIntVar(0, 7, f"short_abs_{wi}")

            model.Add(diff == n1_count[wi] - n2_count[wi])
            model.AddAbsEquality(abs_diff, diff)

            objective_terms.append(weights["short_abs"] * abs_diff)

    # P3 — long-shift usage.
    if weights["Д"]:
        for key, var in x.items():
            wi, d, s = key
            if s == "Д":
                objective_terms.append(weights["Д"] * var)

    if weights["Д12"]:
        for key, var in x.items():
            wi, d, s = key
            if s == "Д12":
                objective_terms.append(weights["Д12"] * var)

    # P4 — consecutive long-shift overload.
    # Includes previous Sat/Sun.
    # If FORBID_THREE_CONSECUTIVE_LONG=True, this penalty will normally be zero,
    # because such windows are forbidden.
    if weights["consecutive_long"]:
        for wi in worker_indices:
            for end_pos in range(2, 9):
                l0 = combined_long_expr(wi, end_pos - 2)
                l1 = combined_long_expr(wi, end_pos - 1)
                l2 = combined_long_expr(wi, end_pos)

                overload = model.NewBoolVar(f"long_overload_{wi}_{end_pos}")

                model.Add(overload <= l0)
                model.Add(overload <= l1)
                model.Add(overload <= l2)
                model.Add(overload >= l0 + l1 + l2 - 2)

                objective_terms.append(weights["consecutive_long"] * overload)

    # Optional fairness: distribute long shifts proportionally to long capacity.
    if weights["long_fair"]:
        long_caps = {}

        for wi in worker_indices:
            w = workers[wi]
            target_cells = [week_cell(norm, w, d) for d in range(7)]

            fixed_long = sum(1 for cell in target_cells if cell in LONG_SHIFTS)
            blank_count = sum(1 for cell in target_cells if cell == "")

            cap = min(3, fixed_long + blank_count)
            long_caps[wi] = cap

        denominator = sum(cap for cap in long_caps.values() if cap > 0)
        total_long = total_required_long

        if total_long > 0 and denominator > 0:
            for wi in worker_indices:
                cap = long_caps[wi]

                if cap == 0:
                    continue

                target_scaled = total_long * cap
                max_abs = max(
                    abs(0 - target_scaled),
                    abs(denominator * 3 - target_scaled),
                )

                diff = model.NewIntVar(-max_abs, max_abs, f"long_fair_diff_{wi}")
                abs_dev = model.NewIntVar(0, max_abs, f"long_fair_abs_{wi}")

                model.Add(diff == denominator * long_count[wi] - target_scaled)
                model.AddAbsEquality(abs_dev, diff)

                objective_terms.append(weights["long_fair"] * abs_dev)

    # Optional fairness: minimize long-shift range among comparable workers.
    if weights["long_range"]:
        comparable_workers = []

        for wi in worker_indices:
            w = workers[wi]
            target_cells = [week_cell(norm, w, d) for d in range(7)]

            fixed_long = sum(1 for cell in target_cells if cell in LONG_SHIFTS)
            blank_count = sum(1 for cell in target_cells if cell == "")

            cap = min(3, fixed_long + blank_count)

            if cap == 3:
                comparable_workers.append(wi)

        if len(comparable_workers) >= 2:
            max_long = model.NewIntVar(0, 3, "max_long_comparable")
            min_long = model.NewIntVar(0, 3, "min_long_comparable")

            model.AddMaxEquality(
                max_long,
                [long_count[wi] for wi in comparable_workers],
            )

            model.AddMinEquality(
                min_long,
                [long_count[wi] for wi in comparable_workers],
            )

            objective_terms.append(weights["long_range"] * (max_long - min_long))

    # Optional fairness: distribute second shifts proportionally.
    if weights["second_shift_fair"]:
        # Total long shifts are known globally:
        # total_long = total demand units - total working slots.
        total_short_1 = total_morning - total_required_long
        total_short_2 = total_evening - total_required_long
        total_short = total_short_1 + total_short_2

        if total_short > 0:
            for wi in worker_indices:
                short_count = model.NewIntVar(0, 7, f"short_total_{wi}")
                model.Add(short_count == n1_count[wi] + n2_count[wi])

                max_abs = 7 * max(total_short, total_short_2)

                diff = model.NewIntVar(-max_abs, max_abs, f"second_fair_diff_{wi}")
                abs_dev = model.NewIntVar(0, max_abs, f"second_fair_abs_{wi}")

                model.Add(
                    diff
                    == total_short * n2_count[wi]
                    - total_short_2 * short_count
                )

                model.AddAbsEquality(abs_dev, diff)

                objective_terms.append(weights["second_shift_fair"] * abs_dev)

    if objective_terms:
        model.Minimize(sum(objective_terms))
    else:
        model.Minimize(0)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = float(time_limit_seconds)
    solver.parameters.num_search_workers = int(num_search_workers)
    solver.parameters.random_seed = 123

    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return failed(f"No valid schedule found. Solver status: {solver.StatusName(status)}")

    if require_optimal and status != cp_model.OPTIMAL:
        return failed(
            f"A feasible schedule was found, but optimality was not proven. "
            f"Solver status: {solver.StatusName(status)}"
        )

    # Extract target-week schedule only: Mon..Sun.
    output_schedule = {}

    for wi in worker_indices:
        w = workers[wi]
        row = []

        for d in day_indices:
            chosen = None

            for s in ASSIGNMENTS:
                if solver.Value(x[(wi, d, s)]) == 1:
                    chosen = s
                    break

            if chosen is None:
                return failed(f"Internal error: no shift chosen for {w} on {DAY_SHORT[d]}")

            row.append(chosen)

        output_schedule[w] = row

    valid, reason, score = validate_and_score(
        output_schedule,
        workers,
        norm,
        demand_ab,
    )

    if not valid:
        return failed(f"Validation failed after solving: {reason}")

    return {
        "status": "success",
        "schedule": output_schedule,
        "reason": None,
    }


def calculate_schedule(claims, demands):
    result = solve_schedule(
        claims,
        demands,
        time_limit_seconds=60,
        weight_overrides=BALANCED_WEIGHTS,
        require_optimal=False,
    )

    return result