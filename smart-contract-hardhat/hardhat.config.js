require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

const GOERLI_HTTP_URL = process.env.GOERLI_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: GOERLI_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
