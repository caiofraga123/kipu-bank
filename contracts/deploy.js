const hre = require("hardhat");

/**
 * Deployment script for KipuBank contract
 * 
 * This script deploys the KipuBank contract with a configured withdrawal limit
 * and displays relevant deployment information.
 */
async function main() {
  console.log("🚀 Starting KipuBank deployment...\n");

  // Get deployment account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Configure withdrawal limit (1 ETH in this example)
  const withdrawalLimit = hre.ethers.parseEther("1.0");
  console.log("⚙️  Configuration:");
  console.log("   - Withdrawal Limit:", hre.ethers.formatEther(withdrawalLimit), "ETH");
  console.log("   - Bank Cap: 1000 ETH (hardcoded in contract)\n");

  // Deploy contract
  console.log("📦 Deploying KipuBank contract...");
  const KipuBank = await hre.ethers.getContractFactory("KipuBank");
  const kipuBank = await KipuBank.deploy(withdrawalLimit);

  await kipuBank.waitForDeployment();

  const contractAddress = await kipuBank.getAddress();
  
  console.log("✅ KipuBank deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("\n" + "=".repeat(60));
  
  // Display deployment summary
  console.log("\n📊 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract Name:      KipuBank");
  console.log("Network:           ", hre.network.name);
  console.log("Contract Address:  ", contractAddress);
  console.log("Deployer:          ", deployer.address);
  console.log("Withdrawal Limit:  ", hre.ethers.formatEther(withdrawalLimit), "ETH");
  console.log("Bank Cap:          ", "1000 ETH");
  console.log("=".repeat(60));

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await kipuBank.deploymentTransaction().wait(6);
    console.log("✅ Block confirmations received!");

    // Verification instructions
    console.log("\n🔍 VERIFICATION INSTRUCTIONS");
    console.log("=".repeat(60));
    console.log("Run the following command to verify on Etherscan:\n");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${withdrawalLimit}"`);
    console.log("\n" + "=".repeat(60));
  }

  // Next steps
  console.log("\n📋 NEXT STEPS");
  console.log("=".repeat(60));
  console.log("1. Verify contract on block explorer");
  console.log("2. Update README.md with contract address");
  console.log("3. Test deposit and withdrawal functions");
  console.log("4. Add contract address to your .env file");
  console.log("5. Push changes to GitHub");
  console.log("=".repeat(60));

  // Interaction examples
  console.log("\n💡 QUICK INTERACTION EXAMPLES");
  console.log("=".repeat(60));
  console.log("\nDeposit 0.1 ETH:");
  console.log(`await kipuBank.deposit({ value: ethers.parseEther("0.1") });`);
  console.log("\nWithdraw 0.05 ETH:");
  console.log(`await kipuBank.withdraw(ethers.parseEther("0.05"));`);
  console.log("\nCheck your balance:");
  console.log(`await kipuBank.getMyBalance();`);
  console.log("=".repeat(60) + "\n");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  });