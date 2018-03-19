module.exports = function getAbi() {
	return [
    {
      "constant": true,
      "inputs": [],
      "name": "vestingToken",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "schedules",
      "outputs": [
        {
          "name": "startTimeInSec",
          "type": "uint256"
        },
        {
          "name": "cliffTimeInSec",
          "type": "uint256"
        },
        {
          "name": "endTimeInSec",
          "type": "uint256"
        },
        {
          "name": "totalAmount",
          "type": "uint256"
        },
        {
          "name": "totalAmountWithdrawn",
          "type": "uint256"
        },
        {
          "name": "depositor",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressChangeRequests",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "approvedWallet",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_vestingToken",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "registeredAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "startTimeInSec",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "cliffTimeInSec",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "endTimeInSec",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "totalAmount",
          "type": "uint256"
        }
      ],
      "name": "VestingScheduleRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "registeredAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amountWithdrawn",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "registeredAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amountWithdrawn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "amountRefunded",
          "type": "uint256"
        }
      ],
      "name": "VestingEndedByOwner",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "oldRegisteredAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newRegisteredAddress",
          "type": "address"
        }
      ],
      "name": "AddressChangeRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "oldRegisteredAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newRegisteredAddress",
          "type": "address"
        }
      ],
      "name": "AddressChangeConfirmed",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addressToRegister",
          "type": "address"
        },
        {
          "name": "_depositor",
          "type": "address"
        },
        {
          "name": "_startTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_cliffTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_endTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_totalAmount",
          "type": "uint256"
        },
        {
          "name": "_percentage",
          "type": "uint256"
        }
      ],
      "name": "registerVestingScheduleWithPercentage",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addressToRegister",
          "type": "address"
        },
        {
          "name": "_depositor",
          "type": "address"
        },
        {
          "name": "_startTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_cliffTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_endTimeInSec",
          "type": "uint256"
        },
        {
          "name": "_totalAmount",
          "type": "uint256"
        }
      ],
      "name": "registerVestingSchedule",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_addressToEnd",
          "type": "address"
        },
        {
          "name": "_addressToRefund",
          "type": "address"
        }
      ],
      "name": "endVesting",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newRegisteredAddress",
          "type": "address"
        }
      ],
      "name": "requestAddressChange",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_oldRegisteredAddress",
          "type": "address"
        },
        {
          "name": "_newRegisteredAddress",
          "type": "address"
        }
      ],
      "name": "confirmAddressChange",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_approvedWallet",
          "type": "address"
        }
      ],
      "name": "setApprovedWallet",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
};