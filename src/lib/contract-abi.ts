export const contractABI = [
        {
            "inputs": [
              {
                "internalType": "address[]",
                "name": "committeeMembers",
                "type": "address[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "donor",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "DonationReceived",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
              }
            ],
            "name": "MilestoneCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
              }
            ],
            "name": "MilestoneReleased",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "staker",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "Staked",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "staker",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
              }
            ],
            "name": "Unstaked",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "voter",
                "type": "address"
              }
            ],
            "name": "Voted",
            "type": "event"
          },
          {
            "inputs": [],
            "name": "annualRate",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "committee",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "address payable",
                "name": "serviceProvider",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
              }
            ],
            "name": "createMilestone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              }
            ],
            "name": "donateToMilestone",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "getMilestone",
            "outputs": [
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "serviceProvider",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "released",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "hasVoted",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "milestoneCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "milestones",
            "outputs": [
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "address payable",
                "name": "serviceProvider",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "released",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "stake",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "stakes",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "unstake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              }
            ],
            "name": "voteToRelease",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "votingThreshold",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "stateMutability": "payable",
            "type": "receive"
          }
]