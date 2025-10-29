const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("KipuBank", function () {
  // Fixture to deploy the contract before each test
  async function deployKipuBankFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    
    const withdrawalLimit = ethers.parseEther("1.0");
    const KipuBank = await ethers.getContractFactory("KipuBank");
    const kipuBank = await KipuBank.deploy(withdrawalLimit);
    
    return { kipuBank, owner, user1, user2, withdrawalLimit };
  }

  describe("Deployment", function () {
    it("Should set the correct withdrawal limit", async function () {
      const { kipuBank, withdrawalLimit } = await loadFixture(deployKipuBankFixture);
      expect(await kipuBank.WITHDRAWAL_LIMIT()).to.equal(withdrawalLimit);
    });

    it("Should set the correct bank cap", async function () {
      const { kipuBank } = await loadFixture(deployKipuBankFixture);
      expect(await kipuBank.BANK_CAP()).to.equal(ethers.parseEther("1000"));
    });

    it("Should initialize with zero total deposits", async function () {
      const { kipuBank } = await loadFixture(deployKipuBankFixture);
      expect(await kipuBank.totalDeposits()).to.equal(0);
    });

    it("Should initialize with zero deposit and withdrawal counts", async function () {
      const { kipuBank } = await loadFixture(deployKipuBankFixture);
      expect(await kipuBank.depositCount()).to.equal(0);
      expect(await kipuBank.withdrawalCount()).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should accept a valid deposit", async function () {
      const { kipuBank, user1 } = await loadFixture(deployKipuBankFixture);
      const depositAmount = ethers.parseEther("0.5");

      await expect(kipuBank.connect(user1).deposit({ value: depositAmount }))
        .to.changeEtherBalances([user1, kipuBank], [-depositAmount, depositAmount]);
    });

    it("Should emit Deposit event", async function () {
      const { kipuBank, user1 } = await loadFixture(deployKipuBankFixture);
      const depositAmount = ethers.parseEther("0.5");

      await expect(kipuBank.connect(user1).deposit({ value: depositAmount }))
        .to.emit(kipuBank, "Deposit")
        .withArgs(user1.address, depositAmount, depositAmount);
    });

    it("Should update user vault balance", async function () {
      const { kipuBank, user1 } = await loadFixture(deployKipuBankFixture);
      const depositAmount = ethers.parseEther("0.5");

      await kipuBank.connect(user1).deposit({ value: depositAmount });
      expect(await kipuBank.getVaultBalance(user1.address)).to.equal(depositAmount);
    });

    it("Should update total deposits", async function () {
      const { kipuBank, user1 } = await loadFixture(deployKipuBankFixture);
      const depositAmount = ethers.parseEther("0.5");

      await kipuBank.connect(user1).deposit({ value: depositAmount });
      expect(await kipuBank.totalDeposits()).to.equal(depositAmount);
    });

    it("Should increment deposit count", async function () {
      const { kipuBank, user1 } = await loadFixture(deployKipuBankFixture);
      const depositAmount = ethers.parseEther("0.5");

      await kipuBank.connect(user1).deposit({ value: depositAmount });
      expect(await kipuBank.depositCount()).to.equal(