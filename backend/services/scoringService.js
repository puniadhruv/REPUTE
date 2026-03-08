const { spawn } = require("child_process");
const path = require("path");

/**
 * Call the Python scoring engine with the given CSV file and wallet address.
 *
 * The command executed is (from backend root as cwd):
 *   python ../scoring-engine/credit_score.py <filePath> <walletAddress>
 *
 * The Python script prints a human-readable summary and a JSON line:
 *   JSON: {"wallet": "...", "score": 720, "tier": "Good", "proof_hash": "0x..."}
 *
 * This function parses that JSON segment and returns { score, tier, proofHash }.
 *
 * @param {string} filePath - Path to CSV file relative to backend root (e.g., "uploads/file.csv").
 * @param {string} walletAddress - User's wallet address.
 * @returns {Promise<{score: number, tier: string, proofHash: string}>}
 */
function runScoringEngine(filePath, walletAddress) {
  return new Promise((resolve, reject) => {
    const backendRoot = path.join(__dirname, "..");
    const scriptPath = path.join("..", "scoring-engine", "credit_score.py");

    const args = [scriptPath, filePath, walletAddress];

    const pythonProcess = spawn("python", args, {
      cwd: backendRoot
    });

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `Scoring engine exited with code ${code}: ${stderrData || stdoutData}`
          )
        );
      }

      // Look for a line starting with "JSON:" and parse the trailing JSON.
      const lines = stdoutData.split(/\r?\n/);
      const jsonLine = lines.find((line) => line.trim().startsWith("JSON:"));

      if (!jsonLine) {
        return reject(
          new Error("Scoring engine output did not contain JSON line")
        );
      }

      const jsonPart = jsonLine.replace(/^JSON:\s*/, "");

      try {
        const parsed = JSON.parse(jsonPart);
        const score = parsed.score;
        const tier = parsed.tier;
        const proofHash = parsed.proof_hash;

        if (
          typeof score !== "number" ||
          typeof tier !== "string" ||
          typeof proofHash !== "string"
        ) {
          throw new Error("Invalid data types in scoring engine JSON output");
        }

        return resolve({ score, tier, proofHash });
      } catch (err) {
        return reject(
          new Error(
            `Failed to parse scoring engine JSON output: ${err.message}`
          )
        );
      }
    });

    pythonProcess.on("error", (err) => {
      return reject(
        new Error(`Failed to start scoring engine process: ${err.message}`)
      );
    });
  });
}

module.exports = {
  runScoringEngine
};

