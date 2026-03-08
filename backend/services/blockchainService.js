/**
 * Temporary in-memory blockchain stub for local development.
 * This avoids requiring a running node and ethers while preserving the API.
 */

// Simple per-process store keyed by wallet address.
const reputationStore = new Map();

/**
 * "Store" credit reputation in memory instead of on-chain.
 *
 * @param {string} wallet
 * @param {string} tier
 * @param {string} proofHash
 * @returns {Promise<{transactionHash: string}>}
 */
async function storeReputation(wallet, tier, proofHash) {
  const timestamp = Date.now();
  reputationStore.set(wallet, { wallet, tier, proofHash, timestamp });

  // Fake transaction hash for compatibility with callers.
  return {
    transactionHash: `0xstub${timestamp.toString(16)}`
  };
}

/**
 * Fetch credit reputation from the in-memory store.
 *
 * @param {string} wallet
 * @returns {Promise<{wallet: string, tier: string, proofHash: string, timestamp: number}>}
 */
async function fetchReputation(wallet) {
  const existing = reputationStore.get(wallet);

  if (!existing) {
    return {
      wallet,
      tier: "Unknown",
      proofHash: "0x0",
      timestamp: 0
    };
  }

  return existing;
}

module.exports = {
  storeReputation,
  fetchReputation
};


