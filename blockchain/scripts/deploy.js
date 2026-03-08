const { ethers, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ReputeCredit contract...");

  const ReputeCredit = await ethers.getContractFactory("ReputeCredit");
  const reputeCredit = await ReputeCredit.deploy();

  await reputeCredit.deployed();

  console.log("ReputeCredit deployed to:", reputeCredit.address);

  // Read ABI from Hardhat artifacts
  const artifact = await artifacts.readArtifact("ReputeCredit");

  const contractData = {
    address: reputeCredit.address,
    abi: artifact.abi
  };

  const utilsDir = path.join(__dirname, "..", "utils");
  const outputPath = path.join(utilsDir, "contractData.json");

  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2));

  console.log("Contract data (address + ABI) saved to:", outputPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

