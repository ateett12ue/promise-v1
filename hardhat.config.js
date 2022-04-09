require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  },

  networks: {
    hardhat: {
      inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
      },
      chainId: 1337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    putIt: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    mumbai: {
      url: "https://speedy-nodes-nyc.moralis.io/27686f41b7c9afc73b87dfa2/polygon/mumbai",
      network_id: 80001,
      confirmations: 2,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
    polygon: {
      url: "https://speedy-nodes-nyc.moralis.io/f84f46508f22a737cbbdb355/polygon/mainnet",
      network_id: 137,
      confirmations: 2,
      accounts: {
        mnemonic: "secret",
      },
    },
  },
  solidity: "0.8.10",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yul: true,
      },
    },
  },
};
