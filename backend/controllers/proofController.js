const { generateProofHash } = require('../utils/hashGenerator');

const generateProof = (req, res) => {
  const { walletAddress, creditScore, tier } = req.body || {};

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'walletAddress is required and must be a string.' });
  }

  if (typeof creditScore !== 'number' || Number.isNaN(creditScore)) {
    return res.status(400).json({ error: 'creditScore is required and must be a number.' });
  }

  if (!tier || typeof tier !== 'string') {
    return res.status(400).json({ error: 'tier is required and must be a string.' });
  }

  try {
    const proofHash = generateProofHash(walletAddress, creditScore, tier);

    return res.status(200).json({
      walletAddress,
      tier,
      proofHash,
    });
  } catch (err) {
    console.error('Failed to generate proof hash:', err);
    return res.status(500).json({ error: 'Failed to generate proof hash' });
  }
};

module.exports = {
  generateProof,
};

