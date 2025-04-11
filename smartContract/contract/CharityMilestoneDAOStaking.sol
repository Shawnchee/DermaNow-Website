// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CharityMilestoneDAOStaking {
    address public owner;
    uint256 public rewardRatePerSecond = 3; // 3% reward per second for demo purposes
    uint256 public votingThreshold = 3; // Number of votes required to release funds
    uint256 public milestoneCount = 0;

    struct Milestone {
        string description;
        address payable serviceProvider;
        uint256 targetAmount;
        uint256 currentAmount;
        bool released;
        uint256 voteCount;
        mapping(address => bool) votes;
    }

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        bool active;
    }

    mapping(uint256 => Milestone) public milestones;
    mapping(address => bool) public committee;
    mapping(address => StakeInfo) public stakes;

    event MilestoneCreated(uint256 milestoneId, string description, uint256 targetAmount);
    event DonationReceived(uint256 milestoneId, address donor, uint256 amount);
    event Voted(uint256 milestoneId, address voter);
    event MilestoneReleased(uint256 milestoneId, address to);
    event Staked(address staker, uint256 amount);
    event Unstaked(address staker, uint256 amount, uint256 reward);

    constructor(address[] memory committeeMembers) {
        owner = msg.sender;
        
        // Initialize committee members
        for (uint i = 0; i < committeeMembers.length; i++) {
            committee[committeeMembers[i]] = true;
        }
    }

    // Create a new milestone
    function createMilestone(string memory description, address payable serviceProvider, uint256 targetAmount) public {
        require(committee[msg.sender], "Only committee members can create milestones");
        
        Milestone storage newMilestone = milestones[milestoneCount];
        newMilestone.description = description;
        newMilestone.serviceProvider = serviceProvider;
        newMilestone.targetAmount = targetAmount;
        newMilestone.currentAmount = 0;
        newMilestone.released = false;
        newMilestone.voteCount = 0;
        
        emit MilestoneCreated(milestoneCount, description, targetAmount);
        milestoneCount++;
    }

    // Donate to a milestone
    function donateToMilestone(uint256 milestoneId) public payable {
        require(milestoneId < milestoneCount, "Milestone does not exist");
        require(!milestones[milestoneId].released, "Milestone already released");
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        milestones[milestoneId].currentAmount += msg.value;
        
        emit DonationReceived(milestoneId, msg.sender, msg.value);
    }

    // Vote to release funds for a milestone
    function voteToRelease(uint256 milestoneId) public {
        require(committee[msg.sender], "Only committee members can vote");
        require(milestoneId < milestoneCount, "Milestone does not exist");
        require(!milestones[milestoneId].released, "Milestone already released");
        require(!milestones[milestoneId].votes[msg.sender], "Already voted");
        
        milestones[milestoneId].votes[msg.sender] = true;
        milestones[milestoneId].voteCount++;
        
        emit Voted(milestoneId, msg.sender);
        
        // If voting threshold is reached, release the funds
        if (milestones[milestoneId].voteCount >= votingThreshold) {
            milestones[milestoneId].released = true;
            milestones[milestoneId].serviceProvider.transfer(milestones[milestoneId].currentAmount);
            
            emit MilestoneReleased(milestoneId, milestones[milestoneId].serviceProvider);
        }
    }

    // Check if an address has voted for a milestone
    function hasVoted(uint256 milestoneId, address voter) public view returns (bool) {
        require(milestoneId < milestoneCount, "Milestone does not exist");
        return milestones[milestoneId].votes[voter];
    }

    // Get milestone details
    function getMilestone(uint256 id) public view returns (
        string memory description,
        address serviceProvider,
        uint256 targetAmount,
        uint256 currentAmount,
        bool released,
        uint256 voteCount
    ) {
        require(id < milestoneCount, "Milestone does not exist");
        Milestone storage milestone = milestones[id];
        
        return (
            milestone.description,
            milestone.serviceProvider,
            milestone.targetAmount,
            milestone.currentAmount,
            milestone.released,
            milestone.voteCount
        );
    }

    // Stake ETH
    function stake() public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        
        // If already staking, add to existing stake
        if (stakes[msg.sender].active) {
            // Calculate rewards before adding new stake
            uint256 currentTime = block.timestamp;
            uint256 stakeDuration = currentTime - stakes[msg.sender].startTime;
            
            // MODIFIED: Calculate reward at 3% per second for demo purposes
            uint256 reward = (stakes[msg.sender].amount * rewardRatePerSecond * stakeDuration) / 100;
            
            // Update stake with new amount and reset start time
            stakes[msg.sender].amount += msg.value + reward;
            stakes[msg.sender].startTime = currentTime;
        } else {
            // New stake
            stakes[msg.sender] = StakeInfo({
                amount: msg.value,
                startTime: block.timestamp,
                active: true
            });
        }
        
        emit Staked(msg.sender, msg.value);
    }

    // Unstake ETH and receive rewards
    function unstake() public {
        require(stakes[msg.sender].active, "No active stake found");
        
        uint256 amount = stakes[msg.sender].amount;
        uint256 currentTime = block.timestamp;
        uint256 stakeDuration = currentTime - stakes[msg.sender].startTime;
        
        // MODIFIED: Calculate reward at 3% per second for demo purposes
        uint256 reward = (amount * rewardRatePerSecond * stakeDuration) / 100;
        
        // Reset stake
        stakes[msg.sender].active = false;
        stakes[msg.sender].amount = 0;
        
        // Transfer staked amount + reward
        uint256 totalAmount = amount + reward;
        
        // Make sure contract has enough balance
        require(address(this).balance >= totalAmount, "Contract has insufficient balance");
        
        // Transfer funds
        payable(msg.sender).transfer(totalAmount);
        
        emit Unstaked(msg.sender, amount, reward);
    }

    // Calculate current rewards without unstaking (view function)
    function calculateCurrentRewards(address staker) public view returns (uint256) {
        if (!stakes[staker].active) {
            return 0;
        }
        
        uint256 amount = stakes[staker].amount;
        uint256 currentTime = block.timestamp;
        uint256 stakeDuration = currentTime - stakes[staker].startTime;
        
        // MODIFIED: Calculate reward at 3% per second for demo purposes
        return (amount * rewardRatePerSecond * stakeDuration) / 100;
    }

    // Donate rewards to a milestone without unstaking
    function donateRewardsToMilestone(uint256 milestoneId) public {
        require(stakes[msg.sender].active, "No active stake found");
        require(milestoneId < milestoneCount, "Milestone does not exist");
        require(!milestones[milestoneId].released, "Milestone already released");
        
        uint256 currentTime = block.timestamp;
        uint256 stakeDuration = currentTime - stakes[msg.sender].startTime;
        
        // MODIFIED: Calculate reward at 3% per second for demo purposes
        uint256 reward = (stakes[msg.sender].amount * rewardRatePerSecond * stakeDuration) / 100;
        
        require(reward > 0, "No rewards available to donate");
        require(address(this).balance >= reward, "Contract has insufficient balance for reward");
        
        // Reset staking time but keep the principal amount
        stakes[msg.sender].startTime = currentTime;
        
        // Add reward to milestone
        milestones[milestoneId].currentAmount += reward;
        
        emit DonationReceived(milestoneId, msg.sender, reward);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
