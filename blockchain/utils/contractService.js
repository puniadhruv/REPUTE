const { ethers } = require("ethers");
const path = require("path");

// Load compiled contract data (address + ABI) produced by the deployment script
// This keeps on-chain interaction logic centralized and easy to reuse.
// eslint-disable-next-line import/no-dynamic-require, global-require
const contractData = require(path.join(__dirname, "contractData.json"));

// Default provider for backend usage; frontend is expected to access this
// functionality via backend API calls (not directly from the browser).
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  // For security, we avoid hardcoding any default private key.
  // The backend must configure PRIVATE_KEY in its environment.
  // eslint-disable-next-line no-console
  console.warn(
    "Warning: PRIVATE_KEY is not set. updateReputation will fail until it is configured."
  );
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : provider;

const contract = new ethers.Contract(
  contractData.address,
  contractData.abi,
  signer
);

/**
 * Updates the credit reputation of a wallet.
 *
 * @param {string} wallet - The user's wallet address.
 * @param {string} tier - The credit tier (e.g., "Excellent", "Good", "Average", "Risky").
 * @param {string} hash - The bytes32 proof hash as a hex string (0x...).
 * @returns {Promise<ethers.providers.TransactionResponse>} The transaction response.
 */
async function updateReputation(wallet, tier, hash) {
  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not configured for updateReputation");
  }

  if (!ethers.utils.isAddress(wallet)) {
    throw new Error("Invalid wallet address");
  }

  const tx = await contract.updateReputation(wallet, tier, hash);
  await tx.wait();
  return tx;
}

/**
 * Fetches the credit reputation of a wallet.
 *
 * @param {string} wallet - The user's wallet address.
 * @returns {Promise<{tier: string, proofHash: string, timestamp: number}>}
 */
async function getReputation(wallet) {
  if (!ethers.utils.isAddress(wallet)) {
    throw new Error("Invalid wallet address");
  }

  const [tier, proofHash, timestamp] = await contract.getReputation(wallet);

  return {
    tier,
    proofHash,
    timestamp: timestamp.toNumber ? timestamp.toNumber() : Number(timestamp)
  };
}

module.exports = {
  updateReputation,
  getReputation
};

