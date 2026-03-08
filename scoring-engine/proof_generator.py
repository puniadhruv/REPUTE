"""
proof_generator.py

Generates a cryptographic proof hash (SHA-256) for a credit scoring result.

The hash commits to:
    - wallet address
    - numeric score
    - credit tier
    - timestamp (seconds since epoch)

The resulting hash is returned as a 0x-prefixed hex string suitable for
use as a bytes32 value on the blockchain.
"""

from __future__ import annotations

import hashlib
import time
from typing import Optional


def generate_proof_hash(
    wallet: str, score: int, tier: str, timestamp: Optional[int] = None
) -> str:
    """
    Generate a deterministic SHA-256 proof hash.

    Args:
        wallet: User's wallet address (string as used on-chain).
        score: Numeric credit score.
        tier: Credit tier string (e.g., "Good").
        timestamp: Optional unix timestamp; if omitted, current time is used.

    Returns:
        0x-prefixed hex string representing 32-byte hash.
    """
    if timestamp is None:
        timestamp = int(time.time())

    # Concatenate the fields with a clear separator to avoid ambiguity.
    payload = f"{wallet}|{score}|{tier}|{timestamp}"
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return "0x" + digest


__all__ = ["generate_proof_hash"]

