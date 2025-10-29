# 🚀 KipuBank Setup Guide

Complete step-by-step guide to set up, deploy, and verify your KipuBank smart contract.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Node.js v18 or higher installed
- ✅ Git installed
- ✅ MetaMask wallet with testnet ETH
- ✅ Code editor (VS Code recommended)
- ✅ Basic knowledge of terminal/command line

## 🛠️ Step 1: Project Setup

### 1.1 Create Project Directory

```bash
mkdir kipu-bank
cd kipu-bank
```

### 1.2 Initialize Node.js Project

```bash
npm init -y
```

### 1.3 Install Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install dotenv
```

### 1.4 Initialize Hardhat

```bash
npx hardhat init
```

Select: **Create a JavaScript project**

## 📁 Step 2: Project Structure

Create the following folder structure:

```
kipu-bank/
├── contracts/
│   └── KipuBank.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── KipuBank.test.js
├── .env
├── .env.example
├── .gitignore
├── hardhat.config.js
├── package.json
└── README.md
```

### 2.1 Create .gitignore

```bash
echo "node_modules
.env
coverage
coverage.json
typechain
typechain-types
cache
artifacts" > .gitignore
```

## 🔑 Step 3: Get Your API Keys

### 3.1 Get Alchemy/Infura RPC URL

**Option A: Alchemy (Recommended)**
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Sign up for free account
3. Create new app → Select "Ethereum" → "Sepolia"
4. Copy the HTTPS URL

**Option B: Infura**
1. Go to [infura.io](https://www.infura.io/)
2. Sign up and create new project
3. Copy the Sepolia endpoint

### 3.2 Get Etherscan API Key

1. Go to [etherscan.io](https://etherscan.io/register)
2. Create free account
3. Go to "API Keys" section
4. Create new API key
5. Copy the key

### 3.3 Export Your Private Key

⚠️ **SECURITY WARNING**: Never share your private key!

1. Open MetaMask
2. Click account icon → Account Details
3. Click "Export Private Key"
4. Enter password
5. Copy the key (remove "0x" prefix)

## ⚙️ Step 4: Configure Environment

### 4.1 Create .env File

```bash
cp .env.example .env
```

### 4.2 Edit .env File

Open `.env` and add your credentials:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 💰 Step 5: Get Testnet ETH

You need Sepolia ETH to deploy the contract.

### Sepolia Faucets:

1. **Alchemy Faucet**: https://sepoliafaucet.com/
2. **Infura Faucet**: https://www.infura.io/faucet/sepolia
3. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

**How to use:**
1. Copy your MetaMask wallet address
2. Visit any faucet above
3. Paste your address and request ETH
4. Wait 1-2 minutes for confirmation

## 📝 Step 6: Add Contract Files

Copy the provided files to your project:

1. **KipuBank.sol** → `contracts/KipuBank.sol`
2. **deploy.js** → `scripts/deploy.js`
3. **KipuBank.test.js** → `test/KipuBank.test.js`
4. **hardhat.config.js** → `hardhat.config.js`
5. **README.md** → `README.md`

## 🧪 Step 7: Test Your Contract

Run the test suite to ensure everything works:

```bash
npx hardhat test
```

Expected output:
```
  KipuBank
    Deployment
      ✓ Should set the correct withdrawal limit
      ✓ Should set the correct bank cap
    Deposits
      ✓ Should accept a valid deposit
      ✓ Should emit Deposit event
    ...
  30 passing (2s)
```

### Run with gas reporting:

```bash
REPORT_GAS=true npx hardhat test
```

## 🚀 Step 8: Deploy to Sepolia

### 8.1 Compile Contract

```bash
npx hardhat compile
```

### 8.2 Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 8.3 Save Contract Address

Copy the deployed contract address from the output:
```
✅ KipuBank deployed successfully!
📍 Contract Address: 0x1234567890abcdef...
```

## ✅ Step 9: Verify on Etherscan

### 9.1 Verify Contract

Replace `CONTRACT_ADDRESS` and `WITHDRAWAL_LIMIT` with your values:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS "1000000000000000000"
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234...abcd "1000000000000000000"
```

### 9.2 Confirm Verification

1. Go to Etherscan: https://sepolia.etherscan.io
2. Search for your contract address
3. You should see a green checkmark ✅ on the "Contract" tab
4. The source code should be visible

## 📱 Step 10: Interact with Your Contract

### Using Etherscan

1. Go to your verified contract on Etherscan
2. Click "Contract" → "Write Contract"
3. Click "Connect to Web3" (connects MetaMask)
4. Try these functions:

**Deposit 0.1 ETH:**
- Click on `deposit`
- Enter `0.1` in the payableAmount field
- Click "Write"
- Confirm transaction in MetaMask

**Check Balance:**
- Go to "Read Contract" tab
- Click `getMyBalance`
- See your balance in wei

**Withdraw 0.05 ETH:**
- Go to "Write Contract"
- Click on `withdraw`
- Enter `50000000000000000` (0.05 ETH in wei)
- Click "Write"
- Confirm transaction

### Using JavaScript

Create `scripts/interact.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const kipuBank = await hre.ethers.getContractAt("KipuBank", contractAddress);
  
  // Deposit
  console.log("Depositing 0.1 ETH...");
  const depositTx = await kipuBank.deposit({ 
    value: hre.ethers.parseEther("0.1") 
  });
  await depositTx.wait();
  console.log("✅ Deposited!");
  
  // Check balance
  const balance = await kipuBank.getMyBalance();
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Withdraw
  console.log("Withdrawing 0.05 ETH...");
  const withdrawTx = await kipuBank.withdraw(
    hre.ethers.parseEther("0.05")
  );
  await withdrawTx.wait();
  console.log("✅ Withdrawn!");
}

main().catch(console.error);
```

Run:
```bash
npx hardhat run scripts/interact.js --network sepolia
```

## 📦 Step 11: Create GitHub Repository

### 11.1 Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: KipuBank smart contract"
```

### 11.2 Create GitHub Repo

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it `kipu-bank`
4. Keep it **PUBLIC**
5. Don't initialize with README
6. Click "Create repository"

### 11.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/kipu-bank.git
git branch -M main
git push -u origin main
```

### 11.4 Update README

Edit `README.md` and add your contract address:

```markdown
## 📝 Contract Details

- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0xYOUR_CONTRACT_ADDRESS`
- **Etherscan**: [View on Etherscan](https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS)
```

Commit and push:
```bash
git add README.md
git commit -m "Add deployed contract address"
git push
```

## ✅ Step 12: Final Checklist

Before submission, verify:

- [ ] Contract deployed to Sepolia testnet
- [ ] Contract verified on Etherscan (green checkmark)
- [ ] README.md includes contract address
- [ ] All code properly commented with NatSpec
- [ ] Tests passing (run `npx hardhat test`)
- [ ] GitHub repository is public
- [ ] Repository named `kipu-bank`
- [ ] .env file is in .gitignore (not pushed)
- [ ] Successfully tested deposit function
- [ ] Successfully tested withdraw function

## 🎓 Submission

Submit the following via the platform:

1. **GitHub Repository URL**: `https://github.com/YOUR_USERNAME/kipu-bank`
2. **Deployed Contract Address**: `0xYOUR_CONTRACT_ADDRESS`
3. **Etherscan Link**: `https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS`

## 🐛 Common Issues & Solutions

### Issue: "insufficient funds for gas"
**Solution**: Get more Sepolia ETH from faucets listed above

### Issue: "nonce too high"
**Solution**: Reset MetaMask account (Settings → Advanced → Reset Account)

### Issue: "cannot estimate gas"
**Solution**: Check your contract has no compilation errors

### Issue: Verification fails
**Solution**: Make sure you're using the exact same constructor parameter (withdrawal limit in wei)

### Issue: "invalid api key"
**Solution**: Double-check your Etherscan API key in .env file

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/)

## 💬 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Search on Stack Overflow
3. Ask in the course community
4. Review Hardhat documentation

---

**🎉 Congratulations!** You've successfully deployed your first production-ready smart contract!

This is the foundation of your Web3 portfolio. Future modules will build upon this project.
