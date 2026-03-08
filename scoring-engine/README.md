# REPUTE Scoring Engine

The scoring engine computes a numeric credit score and tier from off-chain
transaction history and prepares a proof hash suitable for storage on the
ReputeCredit smart contract.

This module **does not** store any personal or raw financial data on-chain.
Only the derived credit tier, proof hash, and timestamp are written via the
existing blockchain module.

## Folder Structure

- `credit_score.py` — main scoring pipeline and CLI entry point.
- `transaction_parser.py` — reads CSV files and converts rows to transaction objects.
- `scoring_rules.py` — implements heuristic rules to turn behavior into a numeric score.
- `proof_generator.py` — generates a SHA-256 proof hash from wallet + score + tier.
- `blockchain_bridge.js` — thin Node.js wrapper around `../blockchain/utils/contractService.js`.
- `sample_transactions.csv` — example data for testing the pipeline.

## Scoring Process

1. **Parse Transactions**
   - Input CSV format:

     ```text
     Date,Amount,Type,Category
     2025-01-05,15000,Credit,Income
     2025-01-10,-4500,Debit,Rent
     2025-01-18,-800,Debit,Electricity
     ...
     ```

   - `transaction_parser.py` converts each row into a `Transaction` object with:
     - `date` — `datetime.date`
     - `amount` — positive for credits, negative for debits
     - `type` — `"Credit"` or `"Debit"`
     - `category` — e.g. `"Rent"`, `"Electricity"`, `"Mobile Recharge"`.

2. **Apply Scoring Rules**
   - `scoring_rules.py` starts from a **base score of 300** and clamps between **300 and 900**.
   - Rules:
     - `+50` if rent is paid in every month of the observed period.
     - `+40` if electricity is paid in every month.
     - `+30` if mobile recharge is present every month.
     - `+60` if there are **no missed payments** across the above categories.
     - `-40` if any of these recurring payments is missing in at least one month.
     - `-30` if the minimum running balance (starting from 0) drops below `-10,000`.

3. **Map Score → Tier**
   - Implemented in `credit_score.py`:
     - score ≥ 750 → `"Excellent"`
     - score ≥ 650 → `"Good"`
     - score ≥ 550 → `"Average"`
     - score <  550 → `"Risky"`

4. **Generate Proof Hash**
   - `proof_generator.py` computes a SHA-256 hash over:
     - wallet address
     - numeric score
     - credit tier
     - current timestamp (seconds since epoch)
   - The result is returned as a `0x`-prefixed hex string (compatible with `bytes32`):

     ```text
     0x<64-hex-chars>
     ```

5. **Send to Blockchain**
   - `blockchain_bridge.js` imports:

     ```js
     const { updateReputation } = require("../blockchain/utils/contractService");
     ```

   - It exposes:

     ```js
     async function sendScoreToBlockchain(wallet, tier, proofHash) {
       return updateReputation(wallet, tier, proofHash);
     }
     ```

   - This updates the on-chain `ReputeCredit` record with:
     - `wallet` → `tier`, `proofHash`, and the on-chain timestamp.

## Running the Scoring Engine (CLI)

From the `repute/scoring-engine` directory:

```bash
python credit_score.py sample_transactions.csv 0xUSERWALLETADDRESS
```

Example output:

```text
Wallet: 0xUSERWALLETADDRESS
Score: 720
Tier: Good
Proof Hash: 0xabc123...

JSON: {"wallet": "...", "score": 720, "tier": "Good", "proof_hash": "0xabc123..."}
```

This CLI **only computes and prints** the result plus proof hash. It does not
directly broadcast to the blockchain; that is handled by backend code using
`blockchain_bridge.js`.

## Backend Integration with Blockchain

In your backend (Node.js), you can combine the Python scoring engine and
the blockchain bridge as follows:

1. Call `credit_score.py` from your backend (e.g., via `child_process.spawn`)
   to obtain `score`, `tier`, and `proof_hash` for a given wallet and CSV.
2. Use `blockchain_bridge.js` to send the result to the blockchain:

   ```js
   const { sendScoreToBlockchain } = require("./blockchain_bridge");

   async function persistReputation(wallet, tier, proofHash) {
     await sendScoreToBlockchain(wallet, tier, proofHash);
   }
   ```

3. The bridge relies on `../blockchain/utils/contractService.js`, which expects:
   - `RPC_URL` — JSON-RPC endpoint for the target network (default `http://127.0.0.1:8545`).
   - `PRIVATE_KEY` — private key of the account that is allowed to update reputations.

With this setup:

- **Python** handles sensitive scoring logic and proof generation.
- **Node.js** and the existing blockchain module handle the on-chain write:
  `updateReputation(wallet, tier, proofHash)`.

