// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputeCredit
 * @notice Stores tamper-resistant credit reputation proofs for wallet addresses.
 *         Only the contract owner (backend scoring engine operator) can update reputations.
 *         No personal or raw financial data is stored on-chain.
 */
contract ReputeCredit is Ownable {
    struct CreditRecord {
        string tier;
        bytes32 proofHash;
        uint256 timestamp;
    }

    /// @notice Mapping of wallet address to its latest credit record
    mapping(address => CreditRecord) public records;

    /// @notice Emitted whenever a user's reputation is updated
    event ReputationUpdated(
        address indexed user,
        string tier,
        bytes32 proofHash,
        uint256 timestamp
    );

    /**
     * @notice Updates the reputation for a given user.
     * @dev Only callable by the contract owner.
     * @param user The wallet address whose reputation is being updated.
     * @param tier The credit score tier (e.g., Excellent, Good, Average, Risky).
     * @param proofHash A bytes32 hash proving the off-chain scoring data.
     */
    function updateReputation(
        address user,
        string memory tier,
        bytes32 proofHash
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");

        CreditRecord memory record = CreditRecord({
            tier: tier,
            proofHash: proofHash,
            timestamp: block.timestamp
        });

        records[user] = record;

        emit ReputationUpdated(user, tier, proofHash, block.timestamp);
    }

    /**
     * @notice Returns the reputation record for a given user.
     * @param user The wallet address whose reputation is being queried.
     * @return tier The credit tier string.
     * @return proofHash The bytes32 proof hash of the scoring data.
     * @return timestamp The UNIX timestamp of the last update.
     */
    function getReputation(
        address user
    )
        external
        view
        returns (string memory tier, bytes32 proofHash, uint256 timestamp)
    {
        CreditRecord memory record = records[user];
        return (record.tier, record.proofHash, record.timestamp);
    }
}

