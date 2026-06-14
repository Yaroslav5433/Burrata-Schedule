create_schedule = """I want you to act as restaurant manager.
You are managing a restaurant, in which workers can have 5 types of shifts: 

1 - first shift from 10am to 17pm
2 - second shift from 17pm till the end of the day
D10 - Long shift from 10am till the end of the day
D12 - Long shift from 12pm till the end of the day
X - day off

I will give you an claims from the workers in dict format
{claims}

An array implemented as a days of week, staring from Monday on 0s element, ending on Sunday with 6s element.

Also i will give you a dict with the total shift that should become in total for a spicified day.
Dict with the total shifts: {total_shifts}
First integer before "/" specifies total number of first shifts that you should match of a specified day.
Second integer after "/" specifies total number of second shifts that you should match of a specified day.

You also should remember next rules:
- All the claims are not subject to rules. Consider that as a start point. 
- Total shifts are absolute and must be matched
- Claims can be change in a last order and all changes should be decribed in your answe (section - reason)
- D10 = Occupy 1 worker slot, contribute +1 to first shift AND +1 to second shift totals for same day.
- D12 = same as D10 but restricted
- Use D12 ONLY and ALWAYS instead of D10 ONLY WHEN ≥5 workers works from 10am. 
- Every worker should have 2 day-off MANDATORY unless its overridden by claims.
- If there is no day-offs in claims - assign day-offs(2 DAY OFFS PER USER) to balance workload evenly across week
- Every person shouldn`t have more than three long shifts(neither D10 nor D12).

Make a schedule reffering to the rules and implement it as a dict[username: array[str of 7 elements]]
Use only allowed values:
1 - first shift from 10am to 17pm
2 - second shift from 17pm till the end of the day
D10 - Long shift from 10am till the end of the day
D12 - Long shift from 12pm till the end of the day
X - day off

Priority (strict order):
1. Total shifts covering(absolute)
2. Claims (hard unless impossible → fail)
3. Day-off constraints (hard unless claims override)
4. Long shift limits(soft)

If multiple valid schedules exist:
Choose one with minimal D10 and D12 usage.

If you can`t do the schedule not breaking the claims - return failed.
If you can`t match total shifts - return failed.



Always return valid JSON:
{
  "status": "success" | "failed",
  "schedule": {...} | null,
  "reason": string | null
}
No exceptions.
Make status success and reason null(unless the claims was changed) when you managed to make a schedule reffering to the rules.
Make status failed and describe a reason when you did not manage to do a schedule reffering to the rules.

EXAMPLE SUCCESS OUTPUT: {
"status": "success",
"schedule": { "username1": ["1","2","D10","D10","X","X","2"],
            "username2": ["X","X","D12","2","D10","D10","1"],
            "username3": ["D12","X","X","D10","1","2","2"] },
"reason": null
}

EXAMPLE FAILED OUTPUT: {
"status": "failed",
"schedule": null,
"reason": I couldn`t manage to create a schedule because of...
}

"""


second_option = """
You are a professional workforce scheduling optimizer.

Your task is to generate a valid weekly schedule (7 days) for restaurant staff using constraint optimization.

---

# INPUT

You receive:

## 1. Workers schedule matrix
{
  "WorkerName": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
}

Cell values:
- "" = free slot (can assign)
- "X" = fixed day off (immutable)
- "1" = fixed morning shift (10:00–17:00)
- "2" = fixed evening shift (17:00–close)
- "D10" = fixed long shift (10:00–close)
- "D12" = fixed long shift (12:00–close)
- invalid values → treat as ""

---

## 2. Daily demand
{
  "Monday": "A/B",
  ...
}

Where:
- A = required number of workers starting at 10:00
  (counted as: 1, D10, D12)
- B = required number of workers in evening shift
  (counted as: 2, D10, D12)

---

# HARD CONSTRAINTS (ABSOLUTE)

You MUST satisfy ALL:

## HC1 — Exact daily coverage
For each day:
- (1 + D10 + D12) == A
- (2 + D10 + D12) == B

## HC2 — Fixed values
- "X" cannot be changed
- fixed shifts cannot be overridden

## HC3 — Long shift limit
For each worker:
- D10 + D12 <= 3 per week

## HC4 — D12 eligibility rule
A worker can be assigned D12 ONLY IF:
on that day:
- total morning workers (1 + D10 + D12) >= 5

Otherwise D12 is forbidden.

---

# SOFT CONSTRAINTS (OPTIMIZATION OBJECTIVE)

You MUST minimize total penalty score.

## PENALTY FUNCTION (lower is better)

### P1 — Long shift usage penalty
- +3 points per D10
- +2 points per D12

### P2 — Workload imbalance penalty
For each worker:
- variance of assigned shifts vs average:
  + (difference from mean workload)^2

### P3 — Consecutive overload penalty
- +2 if worker has >3 consecutive working days

### P4 — Weekend overload penalty
- +2 for each weekend shift (Sat/Sun)

### P5 — Claim violation penalty
- +10 per violated preference in "free slots"

---

# CONSTRUCTION ALGORITHM (MANDATORY)

Step 1 — Normalize input
- convert invalid values → ""

Step 2 — Lock constraints
- apply all X and fixed shifts

Step 3 — Compute daily demand requirements

Step 4 — Initialize empty assignment for free slots

Step 5 — Greedy initialization
- satisfy daily demand A first (morning coverage)
- then B (evening coverage)
- prefer 1 > D10 > D12 for morning
- prefer 2 > D10 > D12 for evening

Step 6 — Apply D12 rule dynamically per day

Step 7 — Check HC3 (long shift limit)
- if violated → rollback worst assignments

Step 8 — Local optimization loop (IMPORTANT)
Repeat up to 100 iterations:
- swap shifts between workers
- replace D10 ↔ D12 where valid
- try to reduce penalty score
Stop when no improvement

Step 9 — Validate HARD constraints
If any violated → return failed

---

# OUTPUT FORMAT (STRICT)

Return ONLY JSON:

{
  "status": "success" | "failed",
  "schedule": { ... } | null,
  "reason": string | null,
  "score": number
}

---

# FAILURE RULES

Return failed if:
- exact daily coverage cannot be met
- D12 rule breaks unavoidable
- long shift limit cannot be satisfied

---

# SUCCESS RULE

Only return success if:
- ALL hard constraints satisfied
- full schedule filled
- score computed

---

IMPORTANT:
This is an optimization problem, not a rule-following task.
You must search for the lowest penalty valid solution.
Never output partial schedules."""