const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const whitelistContract = await ethers.getContractFactory("Whitelist");
  const constructor = 10

  // here we deploy the contract, the parameter in () is the contructor argument.
  const deployedWhitelistContract = await whitelistContract.deploy(constructor);   // 10 is the Maximum number of whitelisted addresses allowed.
  console.log(`Deploying smart contract...`)                             // This is just so you know what is happening during the process

  // Wait for it to finish deploying.
  await deployedWhitelistContract.deployed();

  // print the address of the deployed contract
  console.log(`The smart contract was deployed at: ${deployedWhitelistContract.address}`);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });