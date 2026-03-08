const crypto = require('crypto');

const generateProofHash = (walletAddress, creditScore, tier) => {
  const normalizedWallet = String(walletAddress).trim();
  const normalizedScore = String(creditScore).trim();
  const normalizedTier = String(tier).trim();

  const payload = `${normalizedWallet}|${normalizedScore}|${normalizedTier}`;

  const hash = crypto.createHash('sha256').update(payload).digest('hex');

  return hash;
};

module.exports = {
  generateProofHash,
};

