const path = require("path");
const { runScoringEngine } = require("../services/scoringService");
const { storeReputation } = require("../services/blockchainService");

/**
 * POST /api/score
 *
 * Body:
 *  {
 *    "wallet": "0xWalletAddress",
 *    "filePath": "uploads/file.csv"
 *  }
 *
 * Steps:
 *  1. Run Python scoring engine on the CSV.
 *  2. Receive { score, tier, proofHash }.
 *  3. Store reputation on blockchain via storeReputation().
 *  4. Return result to caller.
 */
async function handleScore(req, res) {
  try {
    const { wallet, filePath } = req.body || {};

    if (!wallet || !filePath) {
      return res
        .status(400)
        .json({ error: "wallet and filePath are required" });
    }

    // Ensure the file path is treated relative to backend root to prevent path traversal.
    const safeFilePath = path.join("uploads", path.basename(filePath));

    const { score, tier, proofHash } = await runScoringEngine(
      safeFilePath,
      wallet
    );

    await storeReputation(wallet, tier, proofHash);

    return res.status(200).json({
      score,
      tier,
      proofHash,
      message: "Reputation stored on blockchain"
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Score error:", error);
    return res
      .status(500)
      .json({ error: "Failed to score and store reputation" });
  }
}

module.exports = {
  handleScore
};

