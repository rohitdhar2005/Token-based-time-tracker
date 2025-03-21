const CONTRACT_ADDRESS = "0x9ce563C4131561c7378D90E8B409272fF21A8588";
const CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
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
		"name": "balanceOf",
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
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
class TimeTrackerTokenApp {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.initialize();
    }

    async initialize() {
        this.setupEventListeners();
        if (window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }

    setupEventListeners() {
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        document.getElementById('transferButton').addEventListener('click', () => this.transfer());
        document.getElementById('approveButton').addEventListener('click', () => this.approve());
    }

    async connectWallet() {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.signer = this.provider.getSigner();
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
            
            const address = await this.signer.getAddress();
            document.getElementById('walletAddress').textContent = 
                `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            
            await this.updateBalances();
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    async updateBalances() {
        try {
            const address = await this.signer.getAddress();
            const balance = await this.contract.balanceOf(address);
            const totalSupply = await this.contract.totalSupply();

            document.getElementById('tokenBalance').textContent = 
                `${ethers.utils.formatEther(balance)} TTT`;
            document.getElementById('totalSupply').textContent = 
                `${ethers.utils.formatEther(totalSupply)} TTT`;
        } catch (error) {
            console.error('Error updating balances:', error);
        }
    }

    async transfer() {
        try {
            const to = document.getElementById('transferAddress').value;
            const amount = ethers.utils.parseEther(document.getElementById('transferAmount').value);
            
            const tx = await this.contract.transfer(to, amount);
            await this.addTransactionToHistory('Transfer', tx.hash);
            await tx.wait();
            await this.updateBalances();
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    }

    async approve() {
        try {
            const spender = document.getElementById('approveAddress').value;
            const amount = ethers.utils.parseEther(document.getElementById('approveAmount').value);
            
            const tx = await this.contract.approve(spender, amount);
            await this.addTransactionToHistory('Approve', tx.hash);
            await tx.wait();
        } catch (error) {
            console.error('Error approving tokens:', error);
        }
    }

    async addTransactionToHistory(type, hash) {
        const transactionList = document.getElementById('transactionList');
        const txItem = document.createElement('div');
        txItem.className = 'transaction-item';
        txItem.innerHTML = `
            <p>${type} - ${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}</p>
            <a href="https://etherscan.io/tx/${hash}" target="_blank">View on Etherscan</a>
        `;
        transactionList.prepend(txItem);
    }
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new TimeTrackerTokenApp();
});
