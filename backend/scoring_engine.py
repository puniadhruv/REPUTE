import csv
import json
import os
import sys
from typing import List, Dict, Tuple


def load_transactions(csv_path: str) -> List[Dict[str, str]]:
  if not os.path.exists(csv_path):
    raise FileNotFoundError("CSV file not found")

  with open(csv_path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    return list(reader)


def compute_credit_score(transactions: List[Dict[str, str]]) -> Tuple[int, str]:
  """
  Placeholder scoring logic for prototype purposes.

  The logic is intentionally simple:
  - Base score of 650
  - Add up to 100 points based on number of transactions
  - Add up to 50 points based on average positive transaction amount (if a column named 'amount' exists)
  """
  base_score = 650
  tx_count = len(transactions)

  tx_factor = min(tx_count * 2, 100)

  amounts = []
  for row in transactions:
    amount_str = row.get("amount")
    if amount_str is None:
      continue
    try:
      amount = float(amount_str)
    except (TypeError, ValueError):
      continue
    if amount > 0:
      amounts.append(amount)

  avg_positive = sum(amounts) / len(amounts) if amounts else 0.0
  amount_factor = min(int(avg_positive / 10), 50)

  score = max(300, min(850, base_score + tx_factor + amount_factor))

  if score >= 750:
    tier = "A"
  elif score >= 680:
    tier = "B"
  elif score >= 620:
    tier = "C"
  else:
    tier = "D"

  return int(score), tier


def main() -> None:
  if len(sys.argv) < 2:
    print(json.dumps({"error": "Missing CSV file path argument"}))
    sys.exit(1)

  csv_path = sys.argv[1]

  try:
    transactions = load_transactions(csv_path)
    score, tier = compute_credit_score(transactions)
    print(json.dumps({"score": score, "tier": tier}))
  except FileNotFoundError as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
  except Exception as e:
    print(json.dumps({"error": f\"Scoring engine error: {e}\"}))
    sys.exit(1)


if __name__ == "__main__":
  main()

