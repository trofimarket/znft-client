## ZNFT Client Interface

Znft client is the interface for interacting with the ZNFT smart contracts throught web3 protocols.

Table of contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project structure](#project-structure)
  - [Misc](#misc)

---

### Description

Interface for Veraswap built with [Create React App](https://github.com/facebook/create-react-app)

### Built with

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Ethers](https://docs.ethers.io/v5/) - Web3 Library for interacting with the Smart Contracts.
- [Infura](https://infura.io/) - Remote Procedural Calls Client
- [Ant Design for React](https://ant.design/docs/react/introduce) - React UI library that contains a set of high quality components and demos for building rich, interactive user interfaces

# Getting Started

### Prerequisites

To run this project on your machine, the following need to have installed:

- [Node.Js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- npm - Default package manager for Node.Js

### Installation

Step by step instructions on setting up the project and running it

1. Clone the repo
   ```
   git clone https://github.com/znftmarket/znft-client
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Configure the Environment Variables. Example files are found at [here](./.env.development).

   > Please note that without .env files the app will crash and will not start in local.

4. Start development server
   ```
   npm start
   ```

### Project structure

1. Project's static assets (Fonts, Icons, Images) can be found at [src/assets](./src/assets)
2. JSX components are created page specific as well as based on functionality under [src/components](./src/components). Page specific components are found under the src/<folder-name>. Eg., src/dao for all the DAO related pages.
3. All the ABIs of tokens/smart contracts used in the application are found under [src/utils/abi](./src/utils/abi) folder.
4. All smart contract calls can be found at [src/utils](./src/utils) under the notation <function-name>-function.js.
   - [dao-functions.js](./src/utils/dao-functions.js) - Contains the smart contract interactions related to DAO.
   - [auction-functions.js](./src/utils/auction-functions.js) - Contains the functions of smart contract interactions related to auction.
   - [toptime-functions.js](./src/utils/toptime-functions.js) - Contains the functions of smart contract interactions related to toptime.
   - [payment-functions.js](./src/utils/payment-functions.js) - Contains the Approval, Balance & Approval calls of all payment tokens.
   - [nft-functions.js](./src/utils/nft-functions.js) - Contains all smart contract calls related to the NFT Smart Contract.
5. All ipfs related functions are found at [src/utils/ipfs.js](./src/utils/ipfs.js)
6. All graphql queries are found at [src/utils/queries](./src/utils/queries)

### Misc

1. Eslint configuration can be updated at .eslintrc.json at project root directory
