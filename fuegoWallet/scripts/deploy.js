const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const Fuego = await hre.ethers.getContractFactory("Fuego");
  const fuego = await Fuego.deploy(deployer.address);

  await Fuego.waitForDeployment();

  console.log("My NFT deployed to:", await fuego.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });