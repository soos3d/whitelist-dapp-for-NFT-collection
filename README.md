# Whitelist DApp for NFT collection

This repo holds the code for a whitelist DApp for an NFT collection. This DApp allows whitelisting a certain number of addresses that will have free access to the NFT mint.

The purpose of this app is to teach you how you can make a whitelist DApp. The styling is basic, but it gives all the necessary information! 

This repo holds two projects, the smart contract, and the front end. 

The smart contract is written in Solidity and deployed using Hardhat. You can find the smart contract code and project inside the `smart-contract-hardhat` folder. 

The front end uses `Netx.js` and `Tailwind CSS`.

> Note that this DApp is inspired by the whitelist DApp you create following the [Learn web3 DAO courses](https://learnweb3.io/brand/logo-white.png).

## Table of contents

## Prerequisites

* Node.js, [install node js from here](https://nodejs.org/en/download/). 
* Some Goerli ETH. You can get some [from this faucet](https://goerli-faucet.pk910.de/).
* A Goerli endpoint to deploy the smart contract.
    You can get a Goerli endpoint from Chainstack by following these steps:

    1. [Sign up with Chainstack](https://console.chainstack.com/user/account/create).  
    1. [Deploy a node](https://docs.chainstack.com/platform/join-a-public-network).  
    1. [View node access and credentials](https://docs.chainstack.com/platform/view-node-access-and-credentials). 

## Quickstart

### Deploy the smart contract

First step, deploy the smart contract:

1. Clone this repo.
1. Go into the smart contract project folder to deploy a new contract.
    ```sh
    cd smart-contract-hardhat
    ```
1. Rename the `.env.sample` file to `.env` and add your private key, Goerli RPC URL (to deploy), and your Etherscan API key (to verify the contract). If you need a Goerli endpoint, you can get one for free from [Chainstack](https://chainstack.com).
1. Install the dependencies.
    ```sh
    npm install
    ```
1. Compile the smart contract.
    ```sh
    npx hardhat compile
    ```
1. (Optional) In `scripts/deploy.js`, adjust the constructor to decide how many addresses can be whitelisted; 10 is the default number.
    ```js
    // here we deploy the contract, the parameter in () is the contructor argument.
    const deployedWhitelistContract = await whitelistContract.deploy(10);
    ```
1. Deploy the smart contract on Goerli.
    ```sh
    npx hardhat run scripts/deploy.js --network goerli
    ```
1. Verify the smart contract after it was deployed.
    ```sh
    npx hardhat verify --network goerli 0x66fbEf181252952Cd29f3543A0390A7ec0fbc027 "10"
    ```

    Input your contract address, and the constructor value.

Congrats! You just deployed and verified the `Whitelist.sol` smart contract! 

### Run the front-end

To run the front end follow the steps:

1. First, from the project directory, go into the front-end project folder.
    ```sh
    cd frontend-next-app
    ```
1. Install dependencies.
    ```sh
    npm install
    ```
1. Run the command to launch the dev server.
    ```sh
    npm run dev
    ```
The DApp will run on `http://localhost:3000`.

The smart contract is already deployed on Goerli, so the DApp will work out of the box. If you deployed your smart contract, you can change the `contract address` and `ABI` inside `constants/index.js`.

```js
export const WHITELIST_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
```

Once you connect your wallet, the data will update showing:

* How many addresses can be whitelisted.
* How many have already joined the whitelist.
* How many spots are left.

## Code explanation

This DApp uses the [Web3Modal](https://github.com/Web3Modal/web3modal) library to handle the wallet support; this way, your DApp can easily support different wallets.

Inside `pages/index.js`, you will find the main React code. The code is fully commented and you should be able to go through it and understand what is happening.

The TL;DR is that we use the Ethers library to interact with the smart contract and getting the information to display.

This smart contract allows the owner to also modify the number of whitelist spots available after the contract has been deployed. Add a button to do that in the front end as a challenge to learn more; otherwise, you can just call the function from the backend using Etherscan!

To add whitelist spots, call the `addWhiteListSpots` function from [Etherescan](https://goerli.etherscan.io/address/0x66fbEf181252952Cd29f3543A0390A7ec0fbc027#writeContract). 

