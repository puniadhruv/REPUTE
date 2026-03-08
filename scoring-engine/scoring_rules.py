"""
scoring_rules.py

Implements simple heuristic rules to turn payment behavior into a numeric
credit score in the 300–900 range.

Rules (relative to base score 300):
    +50 if rent paid consistently
    +40 if electricity paid on time
    +30 if mobile recharge consistent
    +60 if no missed payments

    -40 if payment missed
    -30 if large negative balance

To operationalize these concepts with only transaction history available,
we make the following assumptions:
    - "Consistent" / "on time" means that for every month in the observed
      period, there is at least one corresponding debit transaction in that
      category (Rent / Electricity / Mobile Recharge).
    - A "missed payment" occurs if a category appears in some months but not
      all months within the observation window.
    - "Large negative balance" is approximated as the minimum running balance
      over the period falling below -10,000 units, starting from a baseline
      balance of 0.
"""

from __future__ import annotations

from collections import defaultdict
from typing import Iterable, Tuple

from transaction_parser import Transaction


BASE_SCORE = 300
MAX_SCORE = 900
MIN_SCORE = 300


def _month_key(date) -> Tuple[int, int]:
    """Return (year, month) key for grouping transactions."""
    return date.year, date.month


def _category_months(
    txs: Iterable[Transaction], category_names: Iterable[str]
) -> set:
    """
    Return the set of (year, month) pairs where any of the given categories
    appears as a debit transaction.
    """
    category_names_norm = {c.lower() for c in category_names}
    months = set()
    for tx in txs:
        if tx.amount >= 0:
            continue  # only consider debits for bill payments
        if tx.category.lower() in category_names_norm:
            months.add(_month_key(tx.date))
    return months


def _all_months(txs: Iterable[Transaction]) -> set:
    """Return the set of (year, month) present in the transaction history."""
    return {_month_key(tx.date) for tx in txs}


def _min_running_balance(txs: Iterable[Transaction]) -> float:
    """
    Compute the minimum running balance given an initial balance of 0.
    Credits increase the balance; debits decrease it.
    """
    balance = 0.0
    min_balance = 0.0
    for tx in txs:
        balance += tx.amount
        min_balance = min(min_balance, balance)
    return min_balance


def calculate_score(transactions: Iterable[Transaction]) -> int:
    """
    Apply heuristic scoring rules to a list of transactions.

    Returns an integer credit score in the range [300, 900].
    """
    txs = list(transactions)
    if not txs:
        # With no history, keep the base score to avoid over-penalizing.
        return BASE_SCORE

    score = BASE_SCORE

    months_all = _all_months(txs)
    total_months = len(months_all)

    missed_payment = False

    # Rent consistency
    rent_months = _category_months(txs, ["Rent"])
    if rent_months and total_months:
        if len(rent_months) == total_months:
            score += 50
        else:
            missed_payment = True

    # Electricity consistency
    electricity_months = _category_months(txs, ["Electricity", "Electricity Bill"])
    if electricity_months and total_months:
        if len(electricity_months) == total_months:
            score += 40
        else:
            missed_payment = True

    # Mobile recharge consistency
    mobile_months = _category_months(
        txs, ["Mobile Recharge", "Mobile", "Phone Recharge"]
    )
    if mobile_months and total_months:
        if len(mobile_months) == total_months:
            score += 30
        else:
            missed_payment = True

    # Missed payments penalty (only once even if multiple categories miss)
    if missed_payment:
        score -= 40
    else:
        # Reward for having no missed payments across tracked categories
        score += 60

    # Large negative balance penalty
    min_balance = _min_running_balance(txs)
    if min_balance < -10000:
        score -= 30

    # Clamp score to allowed range
    score = max(MIN_SCORE, min(MAX_SCORE, score))

    return int(score)


__all__ = ["calculate_score", "BASE_SCORE", "MAX_SCORE", "MIN_SCORE"]

