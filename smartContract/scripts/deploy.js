const hre = require("hardhat");

async function main() {
  // Replace with real committee wallet addresses
  const committee = ["0x483bF34b4444dB73FB0b1b5EBDB0253A4E8b714f"];

  // Compile and deploy the contract
  const Charity = await hre.ethers.getContractFactory("CharityMilestoneDAOStaking");
  const contract = await Charity.deploy(committee);

  await contract.waitForDeployment();

  console.log("✅ Contract deployed to:", contract.target);

  // Initialize the contract with a dummy milestone
  const description = "Build a school in rural Malaysia";
  const serviceProvider = "0x1234567890abcdef1234567890abcdef12345678"; // Replace with a valid address
  const targetAmount = hre.ethers.parseEther("10"); // Target: 10 ETH

  console.log("🚀 Creating a dummy milestone...");
  const tx = await contract.createMilestone(description, serviceProvider, targetAmount);
  await tx.wait();
  console.log("✅ Dummy milestone created!");

  // // Optional: Save ABI + address for frontend use
  // const fs = require("fs");
  // const contractAddress = contract.target;
  // const contractABI = JSON.parse(
  //   fs.readFileSync("./artifacts/contracts/CharityMilestoneDAOStaking.sol/CharityMilestoneDAOStaking.json", "utf8")
  // ).abi;

  // fs.writeFileSync(
  //   "./frontend/constants/contractDetails.json",
  //   JSON.stringify({ address: contractAddress, abi: contractABI }, null, 2)
  // );

  // console.log("📦 Contract details written to frontend/constants/contractDetails.json");
}

main().catch((error) => {
  console.error("❌ Error deploying contract:", error);
  process.exitCode = 1;
});