schedule_prompt = """
You are a workforce scheduling optimizer. Generate a 7-day restaurant staff schedule by satisfying all hard constraints first, then minimizing total penalty.

Return ONLY valid JSON.

INPUTS

1) Worker schedule matrix:
{
  "WorkerName": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
}

Cell meanings:
- "" = assignable blank
- "X" = fixed day off, cannot change
- "1" = fixed 10:00–17:00 shift
- "2" = fixed 17:00–close shift
- "D10" = fixed 10:00–close long shift
- "D12" = fixed 12:00–close long shift
- Any other value = treat as ""

2) Daily demand:
{
  "Monday": "A/B",
  ...
}

Where:
- A = required morning coverage
- B = required evening coverage

SHIFT COUNTING

For each day:
- Morning coverage = count(1) + count(D10) + count(D12)
- Evening coverage = count(2) + count(D10) + count(D12)
- D10 and D12 count toward BOTH morning and evening
- X is never assignable
- Every non-X cell must contain exactly one of: "1", "2", "D10", "D12"

HARD CONSTRAINTS

HC1 — Exact daily coverage:
For every day:
- morning coverage == A
- evening coverage == B

HC2 — Fixed values:
- Preserve all fixed X, 1, 2, D10, D12 cells exactly.

HC3 — Weekly long-shift limit:
For each worker:
- count(D10) + count(D12) <= 3
- Include both fixed and assigned long shifts.

HC4 — D12 eligibility:
A D12 may appear on a day only if:
- count(1) + count(D10) >= 5 on that same day
- Do NOT count D12 in this eligibility check.

FAST SOLVING METHOD

Normalize first:
- Convert invalid tokens to "".
- Lock all fixed cells.

Use this derived daily quota logic to reduce search:

For each day d:
- N = number of non-X workers that day
- A/B = demand
- Required total long shifts that day:
  L = A + B - N

If L < 0 or L > min(A, B), fail immediately.

Final daily counts must satisfy:
- total count(D10) + count(D12) = L
- total count(1) = A - L
- total count(2) = B - L

Subtract fixed counts from these totals to get remaining daily quotas for blanks:
- need1
- need2
- needLong = needD10 + needD12

If any quota is negative, fail immediately.

Then search globally over all blank cells using the quotas, worker long-shift limits, and D12 eligibility. Do not greedily finalize days independently. Use branch-and-bound or equivalent exact search to minimize score.

OBJECTIVE: MINIMIZE TOTAL PENALTY

Compute score over the final complete schedule:

P1 — Rest-gap penalty:
For each worker and adjacent day pair Mon→Tue, Tue→Wed, ..., Sat→Sun:
- +10 if day d is one of {"2","D10","D12"}
- and day d+1 is one of {"1","D10"}

P2 — Short-shift balance:
For each worker:
- n1 = count("1")
- n2 = count("2")
- +abs(n1 - n2)

Only count short shifts 1 and 2.

P3 — Long-shift usage:
- +3 per D10
- +2 per D12

P4 — Consecutive long-shift overload:
For each worker:
- +2 for each occurrence of more than 2 consecutive long shifts, where long shift is D10 or D12.

VALIDATION BEFORE OUTPUT

Before returning success, recheck from scratch:
- Every non-X cell is filled.
- All fixed cells are unchanged.
- Every day exactly matches A/B demand.
- No worker has more than 3 total D10/D12 shifts.
- Every day containing D12 satisfies count(1) + count(D10) >= 5.
- Final score is recalculated from the completed schedule.

If no valid exact schedule exists, return failed.

OUTPUT JSON ONLY

{
  "status": "success" | "failed",
  "schedule": {
    "WorkerName": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  } | null,
  "reason": string | null,
}"""