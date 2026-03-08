const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputeCredit", function () {
  let ReputeCredit;
  let reputeCredit;
  let owner;
  let user;
  let lender;

  beforeEach(async function () {
    [owner, user, lender] = await ethers.getSigners();

    ReputeCredit = await ethers.getContractFactory("ReputeCredit");
    reputeCredit = await ReputeCredit.deploy();
    await reputeCredit.deployed();
  });

  it("should deploy and set the correct owner", async function () {
    const contractOwner = await reputeCredit.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("should allow owner to update reputation and store correct values", async function () {
    const tier = "Good";
    const proofHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("sample-proof-data")
    );

    const tx = await reputeCredit.updateReputation(
      user.address,
      tier,
      proofHash
    );
    await tx.wait();

    const [storedTier, storedProofHash, storedTimestamp] =
      await reputeCredit.getReputation(user.address);

    expect(storedTier).to.equal(tier);
    expect(storedProofHash).to.equal(proofHash);
    expect(storedTimestamp).to.be.gt(0);
  });

  it("should prevent non-owner from updating reputation", async function () {
    const tier = "Risky";
    const proofHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("another-proof")
    );

    await expect(
      reputeCredit
        .connect(user)
        .updateReputation(user.address, tier, proofHash)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});

