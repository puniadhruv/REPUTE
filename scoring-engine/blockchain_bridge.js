// blockchain_bridge.js
//
// Connects the Python scoring engine with the existing blockchain module.
// This file exposes a simple function that backend code can call after
// computing the credit tier and proof hash in Python.
//
// Usage example in Node.js:
//   const { sendScoreToBlockchain } = require("./blockchain_bridge");
//   await sendScoreToBlockchain(wallet, tier, proofHash);
//
// Under the hood this uses ../blockchain/utils/contractService.js, which
// wraps the deployed ReputeCredit smart contract.

const { updateReputation } = require("../blockchain/utils/contractService");

/**
 * Send a scored credit reputation to the blockchain.
 *
 * @param {string} wallet - User wallet address.
 * @param {string} tier - Credit tier string ("Excellent" | "Good" | "Average" | "Risky").
 * @param {string} proofHash - 0x-prefixed SHA-256 hash produced by the Python engine.
 * @returns {Promise<import("ethers").providers.TransactionResponse>}
 */
async function sendScoreToBlockchain(wallet, tier, proofHash) {
  // Delegates to the underlying contractService helper, which handles
  // provider and signer configuration.
  return updateReputation(wallet, tier, proofHash);
}

module.exports = {
  sendScoreToBlockchain
};

