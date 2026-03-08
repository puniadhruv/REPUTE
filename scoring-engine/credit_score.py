"""
credit_score.py

Main entry point for the REPUTE scoring engine.

Responsibilities:
    - Load transaction CSV
    - Parse into structured transactions
    - Apply scoring rules to compute a numeric score
    - Map score to a credit tier
    - Generate a cryptographic proof hash
    - Print scoring result to CLI

Usage (CLI):
    python credit_score.py sample_transactions.csv 0xUSERWALLETADDRESS
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, asdict
from typing import Dict

from transaction_parser import parse_transactions
from scoring_rules import calculate_score
from proof_generator import generate_proof_hash


@dataclass
class CreditResult:
    """Represents the scoring result for a given wallet."""

    wallet: str
    score: int
    tier: str
    proof_hash: str


def score_to_tier(score: int) -> str:
    """
    Map a numeric score to a credit tier.

    Tiers:
        Score >= 750 -> "Excellent"
        Score >= 650 -> "Good"
        Score >= 550 -> "Average"
        Score < 550  -> "Risky"
    """
    if score >= 750:
        return "Excellent"
    if score >= 650:
        return "Good"
    if score >= 550:
        return "Average"
    return "Risky"


def compute_credit_result(csv_path: str, wallet: str) -> CreditResult:
    """
    Full scoring pipeline for a given CSV + wallet.
    """
    transactions = parse_transactions(csv_path)
    score = calculate_score(transactions)
    tier = score_to_tier(score)
    proof_hash = generate_proof_hash(wallet, score, tier)

    return CreditResult(wallet=wallet, score=score, tier=tier, proof_hash=proof_hash)


def main(argv=None) -> int:
    """
    Simple CLI for running the scoring engine.

    Example:
        python credit_score.py sample_transactions.csv 0xUSERWALLETADDRESS
    """
    if argv is None:
        argv = sys.argv[1:]

    if len(argv) != 2:
        print(
            "Usage: python credit_score.py <transactions.csv> <wallet_address>",
            file=sys.stderr,
        )
        return 1

    csv_path, wallet = argv

    result = compute_credit_result(csv_path, wallet)

    # Print both a human-readable summary and a JSON payload that
    # backend systems can easily parse if they shell out to this script.
    print(f"Wallet: {result.wallet}")
    print(f"Score: {result.score}")
    print(f"Tier: {result.tier}")
    print(f"Proof Hash: {result.proof_hash}")

    print("\nJSON:", json.dumps(asdict(result)))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

