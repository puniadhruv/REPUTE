const { fetchReputation } = require("../services/blockchainService");

/**
 * GET /api/reputation/:wallet
 *
 * Returns the on-chain reputation record for a wallet.
 */
async function getReputation(req, res) {
  try {
    const { wallet } = req.params;

    if (!wallet) {
      return res.status(400).json({ error: "wallet parameter is required" });
    }

    const reputation = await fetchReputation(wallet);

    return res.status(200).json(reputation);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Reputation fetch error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch reputation from blockchain" });
  }
}

module.exports = {
  getReputation
};

