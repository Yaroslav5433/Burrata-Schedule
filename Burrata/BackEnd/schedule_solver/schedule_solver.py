from ortools.sat.python import cp_model

### !!! ENTIRE SOLVER HAD BEEN WRITTEN BY GPT 5.5 !!! ###


DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

SHIFTS = ["1", "2", "D10", "D12"]
SHIFT_SET = set(SHIFTS)
LONG_SHIFTS = {"D10", "D12"}
VALID_FIXED = {"X", "1", "2", "D10", "D12"}


# Original prompt weights.
DEFAULT_WEIGHTS = {
    "rest_gap": 10,             # P1
    "short_abs": 1,             # P2
    "d10": 3,                   # P3
    "d12": 2,                   # P3
    "consecutive_long": 2,      # P4

    # Extra optional fairness weights.
    # Keep these 0 if you want exactly your original prompt objective.
    "long_fair": 0,
    "long_range": 0,
    "second_shift_fair": 0,
}


# More balanced preset.
# Use this if you want better distribution of long shifts and second shifts.
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
    """
    Accepts:
    {
        "Monday": "9/12",
        ...
    }

    Also accepts:
    {
        "Mon": "9/12",
        ...
    }
    """
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


def normalize_matrix(input_matrix):
    """
    Converts invalid tokens to "".
    Preserves X, 1, 2, D10, D12.
    """
    if not isinstance(input_matrix, dict):
        raise ValueError("Input schedule matrix must be a dictionary")

    workers = list(input_matrix.keys())
    norm = {}

    for worker in workers:
        row = input_matrix[worker]

        if not isinstance(row, (list, tuple)) or len(row) != 7:
            raise ValueError(f"Worker {worker} must have exactly 7 cells")

        normalized_row = []

        for value in row:
            if value is None:
                token = ""
            else:
                token = str(value).strip()

            if token in VALID_FIXED:
                normalized_row.append(token)
            else:
                normalized_row.append("")

        norm[worker] = normalized_row

    return workers, norm


def derive_daily_quotas(workers, norm, demand_ab):
    """
    Uses your derived quota logic:

    N = number of non-X workers
    L = A + B - N

    Final daily counts:
    long = L
    count(1) = A - L
    count(2) = B - L
    """
    quotas = []

    for d in range(7):
        A, B = demand_ab[d]

        N = sum(1 for w in workers if norm[w][d] != "X")
        L = A + B - N

        if L < 0:
            raise ValueError(
                f"{DAY_LONG[d]} impossible: L = A+B-N = {A}+{B}-{N} = {L} < 0"
            )

        if L > min(A, B):
            raise ValueError(
                f"{DAY_LONG[d]} impossible: L = {L} > min(A,B) = {min(A, B)}"
            )

        total_1 = A - L
        total_2 = B - L
        total_long = L

        fixed_1 = sum(1 for w in workers if norm[w][d] == "1")
        fixed_2 = sum(1 for w in workers if norm[w][d] == "2")
        fixed_long = sum(1 for w in workers if norm[w][d] in LONG_SHIFTS)

        if fixed_1 > total_1:
            raise ValueError(
                f"{DAY_LONG[d]} impossible: fixed 1 shifts = {fixed_1}, "
                f"but allowed total 1 shifts = {total_1}"
            )

        if fixed_2 > total_2:
            raise ValueError(
                f"{DAY_LONG[d]} impossible: fixed 2 shifts = {fixed_2}, "
                f"but allowed total 2 shifts = {total_2}"
            )

        if fixed_long > total_long:
            raise ValueError(
                f"{DAY_LONG[d]} impossible: fixed long shifts = {fixed_long}, "
                f"but allowed total long shifts = {total_long}"
            )

        quotas.append({
            "A": A,
            "B": B,
            "N": N,
            "long": total_long,
            "one": total_1,
            "two": total_2,
        })

    return quotas


def validate_and_score(schedule, workers, norm, demand_ab):
    """
    Rechecks from scratch and recalculates original prompt score P1-P4.
    """
    if set(schedule.keys()) != set(workers):
        return False, "Output workers do not match input workers exactly", None

    # Validate cells and fixed values.
    for w in workers:
        if w not in schedule:
            return False, f"Missing worker in output: {w}", None

        row = schedule[w]

        if not isinstance(row, list) or len(row) != 7:
            return False, f"Worker {w} output row must contain exactly 7 cells", None

        for d in range(7):
            original = norm[w][d]
            final = row[d]

            if original == "X":
                if final != "X":
                    return False, f"Fixed X changed for {w} on {DAY_SHORT[d]}", None
            else:
                if final not in SHIFT_SET:
                    return False, f"Invalid or empty shift for {w} on {DAY_SHORT[d]}: {final}", None

                if original in SHIFT_SET and final != original:
                    return False, f"Fixed shift changed for {w} on {DAY_SHORT[d]}", None

    # Validate coverage and D12 eligibility.
    for d in range(7):
        A, B = demand_ab[d]

        morning = 0
        evening = 0
        has_d12 = False
        d12_base = 0  # count(1) + count(D10)

        for w in workers:
            cell = schedule[w][d]

            if cell in {"1", "D10", "D12"}:
                morning += 1

            if cell in {"2", "D10", "D12"}:
                evening += 1

            if cell == "D12":
                has_d12 = True

            if cell in {"1", "D10"}:
                d12_base += 1

        if morning != A or evening != B:
            return (
                False,
                f"{DAY_LONG[d]} coverage mismatch: got {morning}/{evening}, required {A}/{B}",
                None,
            )

        if has_d12 and d12_base < 5:
            return (
                False,
                f"{DAY_LONG[d]} violates D12 eligibility: count(1)+count(D10) = {d12_base} < 5",
                None,
            )

    # Validate weekly long-shift limit.
    for w in workers:
        long_count = sum(1 for cell in schedule[w] if cell in LONG_SHIFTS)

        if long_count > 3:
            return False, f"{w} has {long_count} long shifts, max allowed is 3", None

    # Recalculate original score.
    score = 0

    for w in workers:
        row = schedule[w]

        # P1 — rest-gap penalty
        for d in range(6):
            today = row[d]
            tomorrow = row[d + 1]

            if today in {"2", "D10", "D12"} and tomorrow in {"1", "D10"}:
                score += 10

        # P2 — short-shift balance
        n1 = sum(1 for cell in row if cell == "1")
        n2 = sum(1 for cell in row if cell == "2")
        score += abs(n1 - n2)

        # P3 — long-shift usage
        for cell in row:
            if cell == "D10":
                score += 3
            elif cell == "D12":
                score += 2

        # P4 — consecutive long-shift overload
        for d in range(2, 7):
            if (
                row[d - 2] in LONG_SHIFTS
                and row[d - 1] in LONG_SHIFTS
                and row[d] in LONG_SHIFTS
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
    """
    Returns exactly:

    {
      "status": "success" | "failed",
      "schedule": {...} | None,
      "reason": string | null
    }
    """

    # Merge weights.
    weights = dict(DEFAULT_WEIGHTS)
    if weight_overrides:
        weights.update(weight_overrides)

    # CP-SAT objectives require integer coefficients.
    weights = {k: int(v) for k, v in weights.items()}

    try:
        demand_ab = parse_demands(daily_demands)
        workers, norm = normalize_matrix(input_matrix)
        quotas = derive_daily_quotas(workers, norm, demand_ab)
    except Exception as e:
        return failed(str(e))

    # Extra precheck: individual fixed long shifts and total long capacity.
    total_required_long = sum(q["long"] for q in quotas)
    total_long_capacity = 0

    for w in workers:
        fixed_long = sum(1 for d in range(7) if norm[w][d] in LONG_SHIFTS)
        blank_count = sum(1 for d in range(7) if norm[w][d] == "")

        if fixed_long > 3:
            return failed(f"{w} has {fixed_long} fixed long shifts, max allowed is 3")

        # Only blank cells and fixed long cells can contribute to long-shift capacity.
        total_long_capacity += min(3, fixed_long + blank_count)

    if total_long_capacity < total_required_long:
        return failed(
            f"Not enough weekly long-shift capacity: required {total_required_long}, "
            f"capacity {total_long_capacity}"
        )

    model = cp_model.CpModel()

    worker_indices = range(len(workers))
    day_indices = range(7)

    # x[worker_index, day, shift] = 1 if assigned.
    x = {}

    for wi in worker_indices:
        w = workers[wi]

        for d in day_indices:
            original = norm[w][d]

            if original == "X":
                continue

            for s in SHIFTS:
                x[(wi, d, s)] = model.NewBoolVar(f"x_{wi}_{d}_{s}")

            # Every non-X cell gets exactly one shift.
            model.Add(sum(x[(wi, d, s)] for s in SHIFTS) == 1)

            # Preserve fixed shifts.
            if original in SHIFT_SET:
                for s in SHIFTS:
                    model.Add(x[(wi, d, s)] == (1 if s == original else 0))

    def xv(wi, d, s):
        return x.get((wi, d, s), 0)

    # Daily quota constraints.
    for d in day_indices:
        q = quotas[d]

        # Exact category quotas from derived logic.
        model.Add(sum(xv(wi, d, "1") for wi in worker_indices) == q["one"])
        model.Add(sum(xv(wi, d, "2") for wi in worker_indices) == q["two"])
        model.Add(
            sum(xv(wi, d, "D10") + xv(wi, d, "D12") for wi in worker_indices)
            == q["long"]
        )

        # Exact coverage, redundant but useful for safety/readability.
        model.Add(
            sum(
                xv(wi, d, "1") + xv(wi, d, "D10") + xv(wi, d, "D12")
                for wi in worker_indices
            )
            == q["A"]
        )

        model.Add(
            sum(
                xv(wi, d, "2") + xv(wi, d, "D10") + xv(wi, d, "D12")
                for wi in worker_indices
            )
            == q["B"]
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
                xv(wi, d, "D10") + xv(wi, d, "D12")
                for d in day_indices
            )
        )

        # HC3 — weekly long-shift limit.
        model.Add(lng <= 3)

        n1_count[wi] = n1
        n2_count[wi] = n2
        long_count[wi] = lng

    # HC4 — D12 eligibility.
    # If any worker has D12 on a day, then count(1)+count(D10) >= 5 that same day.
    for d in day_indices:
        d12_base = sum(
            xv(wi, d, "1") + xv(wi, d, "D10")
            for wi in worker_indices
        )

        for wi in worker_indices:
            if (wi, d, "D12") in x:
                model.Add(d12_base >= 5).OnlyEnforceIf(x[(wi, d, "D12")])

    objective_terms = []

    # P1 — rest-gap penalty.
    if weights["rest_gap"]:
        for wi in worker_indices:
            for d in range(6):
                today_late = (
                    xv(wi, d, "2")
                    + xv(wi, d, "D10")
                    + xv(wi, d, "D12")
                )

                tomorrow_early = (
                    xv(wi, d + 1, "1")
                    + xv(wi, d + 1, "D10")
                )

                gap = model.NewBoolVar(f"rest_gap_{wi}_{d}")

                model.Add(gap <= today_late)
                model.Add(gap <= tomorrow_early)
                model.Add(gap >= today_late + tomorrow_early - 1)

                objective_terms.append(weights["rest_gap"] * gap)

    # P2 — short-shift balance: abs(count(1) - count(2)).
    if weights["short_abs"]:
        for wi in worker_indices:
            diff = model.NewIntVar(-7, 7, f"short_diff_{wi}")
            abs_diff = model.NewIntVar(0, 7, f"short_abs_{wi}")

            model.Add(diff == n1_count[wi] - n2_count[wi])
            model.AddAbsEquality(abs_diff, diff)

            objective_terms.append(weights["short_abs"] * abs_diff)

    # P3 — long-shift usage.
    if weights["d10"]:
        for key, var in x.items():
            wi, d, s = key
            if s == "D10":
                objective_terms.append(weights["d10"] * var)

    if weights["d12"]:
        for key, var in x.items():
            wi, d, s = key
            if s == "D12":
                objective_terms.append(weights["d12"] * var)

    # P4 — consecutive long-shift overload.
    # Counts every 3-day long-shift window.
    # Example: 4 consecutive long shifts produces 2 penalties.
    if weights["consecutive_long"]:
        for wi in worker_indices:
            for d in range(2, 7):
                l0 = xv(wi, d - 2, "D10") + xv(wi, d - 2, "D12")
                l1 = xv(wi, d - 1, "D10") + xv(wi, d - 1, "D12")
                l2 = xv(wi, d, "D10") + xv(wi, d, "D12")

                overload = model.NewBoolVar(f"long_overload_{wi}_{d}")

                model.Add(overload <= l0)
                model.Add(overload <= l1)
                model.Add(overload <= l2)
                model.Add(overload >= l0 + l1 + l2 - 2)

                objective_terms.append(weights["consecutive_long"] * overload)

    # Optional fairness: distribute long shifts proportionally to long-shift capacity.
    #
    # long capacity = min(3, fixed long shifts + blank cells)
    #
    # This prevents cases like:
    # Worker A has 3 long shifts while similar Worker B has 1.
    if weights["long_fair"]:
        long_caps = {}

        for wi in worker_indices:
            w = workers[wi]

            fixed_long = sum(1 for d in day_indices if norm[w][d] in LONG_SHIFTS)
            blank_count = sum(1 for d in day_indices if norm[w][d] == "")

            cap = min(3, fixed_long + blank_count)
            long_caps[wi] = cap

        denominator = sum(cap for cap in long_caps.values() if cap > 0)
        total_long = total_required_long

        if total_long > 0 and denominator > 0:
            for wi in worker_indices:
                cap = long_caps[wi]

                if cap == 0:
                    continue

                # Penalize:
                # abs(denominator * actual_long_i - total_long * cap_i)
                target_scaled = total_long * cap
                max_abs = max(
                    abs(0 - target_scaled),
                    abs(denominator * cap - target_scaled),
                )

                diff = model.NewIntVar(-max_abs, max_abs, f"long_fair_diff_{wi}")
                abs_dev = model.NewIntVar(0, max_abs, f"long_fair_abs_{wi}")

                model.Add(diff == denominator * long_count[wi] - target_scaled)
                model.AddAbsEquality(abs_dev, diff)

                objective_terms.append(weights["long_fair"] * abs_dev)

    # Optional fairness: minimize long-shift range among comparable workers.
    #
    # Only workers with long capacity 3 are compared.
    if weights["long_range"]:
        comparable_workers = []

        for wi in worker_indices:
            w = workers[wi]
            fixed_long = sum(1 for d in day_indices if norm[w][d] in LONG_SHIFTS)
            blank_count = sum(1 for d in day_indices if norm[w][d] == "")
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
    #
    # This is often better than forcing count(1) and count(2) to be equal,
    # because your weekly demand has many more second shifts than first shifts.
    if weights["second_shift_fair"]:
        total_short_1 = sum(q["one"] for q in quotas)
        total_short_2 = sum(q["two"] for q in quotas)
        total_short = total_short_1 + total_short_2

        if total_short > 0:
            for wi in worker_indices:
                short_count = model.NewIntVar(0, 7, f"short_total_{wi}")
                model.Add(short_count == n1_count[wi] + n2_count[wi])

                # Penalize:
                # abs(total_short * n2_i - total_short_2 * short_i)
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

    # Extract schedule.
    output_schedule = {}

    for wi in worker_indices:
        w = workers[wi]
        row = []

        for d in day_indices:
            if norm[w][d] == "X":
                row.append("X")
                continue

            chosen = None

            for s in SHIFTS:
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
    CLAIMS = claims
    DEMANDS = demands

    # Option 1: exactly your original prompt objective.
    # result = solve_schedule(
    #     CLAIMS,
    #     DEMANDS,
    #     time_limit_seconds=30,
    #     weight_overrides=DEFAULT_WEIGHTS,
    # )

    # Option 2: more balanced schedule.
    result = solve_schedule(
        CLAIMS,
        DEMANDS,
        time_limit_seconds=30,
        weight_overrides=BALANCED_WEIGHTS,
        require_optimal=False,
    )

    return result 