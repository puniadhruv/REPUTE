"""
transaction_parser.py

Parses CSV transaction data into a structured list of transaction objects that
the scoring engine can consume.

Input CSV format:
Date,Amount,Type,Category
2025-01-05,15000,Credit,Income
2025-01-10,-4500,Debit,Rent
...
"""

from __future__ import annotations

import csv
import datetime as dt
from dataclasses import dataclass
from typing import List


@dataclass
class Transaction:
    """Represents a single financial transaction."""

    date: dt.date
    amount: float  # positive for credit, negative for debit
    type: str  # "Credit" or "Debit"
    category: str  # e.g. "Rent", "Electricity", "Mobile Recharge"


def parse_transactions(csv_path: str) -> List[Transaction]:
    """
    Read a CSV file of transactions and return a list of Transaction objects.

    This function:
    - parses the CSV
    - converts dates to datetime.date
    - normalizes basic fields (type/category stripped of whitespace)
    """
    transactions: List[Transaction] = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            if not row.get("Date"):
                continue

            date = dt.datetime.strptime(row["Date"], "%Y-%m-%d").date()
            amount = float(row["Amount"])
            tx_type = (row.get("Type") or "").strip()
            category = (row.get("Category") or "").strip()

            transactions.append(
                Transaction(
                    date=date,
                    amount=amount,
                    type=tx_type,
                    category=category,
                )
            )

    # Sort transactions chronologically so downstream logic can safely
    # compute monthly summaries and running balances.
    transactions.sort(key=lambda t: t.date)

    return transactions


__all__ = ["Transaction", "parse_transactions"]

