// Just for reading purpose, real contract deployed in another script file


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CharityMilestoneDAOStaking {
    // ========== STRUCTS ==========
    struct Milestone {
        string description;
        address payable serviceProvider;
        uint256 targetAmount;
        uint256 currentAmount;
        bool released;
        uint256 voteCount;
    }

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        bool active;
    }

    // ========== STATE VARIABLES ==========

    address public owner;
    uint256 public milestoneCount;
    uint256 public votingThreshold = 1; // Can be adjusted
    uint256 public annualRate = 3; // 3% simulated yield

    Milestone[] public milestones;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => bool) public committee;
    mapping(address => StakeInfo) public stakes;

    // ========== EVENTS ==========

    event MilestoneCreated(uint256 milestoneId, string description, uint256 targetAmount);
    event DonationReceived(uint256 milestoneId, address donor, uint256 amount);
    event MilestoneReleased(uint256 milestoneId, address to);
    event Voted(uint256 milestoneId, address voter);
    event Staked(address staker, uint256 amount);
    event Unstaked(address staker, uint256 amount, uint256 reward);

    // ========== MODIFIERS ==========

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyCommittee() {
        require(committee[msg.sender], "Not a committee member");
        _;
    }

    // ========== CONSTRUCTOR ==========

    constructor(address[] memory committeeMembers) {
        owner = msg.sender;
        for (uint i = 0; i < committeeMembers.length; i++) {
            committee[committeeMembers[i]] = true;
        }
    }

    // ========== MILESTONE FUNCTIONS ==========

    function createMilestone(string memory description, address payable serviceProvider, uint256 targetAmount) external onlyOwner {
        milestones.push(Milestone({
            description: description,
            serviceProvider: serviceProvider,
            targetAmount: targetAmount,
            currentAmount: 0,
            released: false,
            voteCount: 0
        }));

        emit MilestoneCreated(milestoneCount, description, targetAmount);
        milestoneCount++;
    }

    function donateToMilestone(uint256 milestoneId) external payable {
        require(milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[milestoneId];
        require(!m.released, "Already released");

        require(msg.value > 0, "No ETH sent");
        m.currentAmount += msg.value;

        emit DonationReceived(milestoneId, msg.sender, msg.value);
    }

    function voteToRelease(uint256 milestoneId) external onlyCommittee {
        require(milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[milestoneId];

        require(!m.released, "Already released");
        require(!hasVoted[milestoneId][msg.sender], "Already voted");

        hasVoted[milestoneId][msg.sender] = true;
        m.voteCount++;

        emit Voted(milestoneId, msg.sender);

        if (m.voteCount >= votingThreshold && m.currentAmount >= m.targetAmount) {
            m.released = true;
            m.serviceProvider.transfer(m.currentAmount);
            emit MilestoneReleased(milestoneId, m.serviceProvider);
        }
    }

    // ========== STAKING FUNCTIONS ==========

    function stake() external payable {
        require(msg.value > 0, "No ETH sent");

        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(!stakeInfo.active, "Already staking");

        stakeInfo.amount = msg.value;
        stakeInfo.startTime = block.timestamp;
        stakeInfo.active = true;

        emit Staked(msg.sender, msg.value);
    }

    function unstake() external {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        console.log("Unstaking for:", msg.sender);
        console.log("Stake active:", stakeInfo.active);
        console.log("Staked amount:", stakeInfo.amount);

        require(stakeInfo.active, "No active stake");
        
        uint256 stakedAmount = stakeInfo.amount;
        uint256 duration = block.timestamp - stakeInfo.startTime;
        console.log("Duration:", duration);

        uint256 reward = (stakedAmount * annualRate * duration) / (365 days * 100);

        require(address(this).balance >= stakedAmount + reward, "Insufficient contract balance");

        stakeInfo.active = false;
        stakeInfo.amount = 0;
        stakeInfo.startTime = 0;

        payable(msg.sender).transfer(stakedAmount + reward);

        emit Unstaked(msg.sender, stakedAmount, reward);
    }

    // ========== UTILITY VIEWS ==========

    function getMilestone(uint256 id) external view returns (
        string memory description,
        address serviceProvider,
        uint256 targetAmount,
        uint256 currentAmount,
        bool released,
        uint256 voteCount
    ) {
        Milestone storage m = milestones[id];
        return (
            m.description,
            m.serviceProvider,
            m.targetAmount,
            m.currentAmount,
            m.released,
            m.voteCount
        );
    }

    receive() external payable {}
}
