import WalletLink from "walletlink";
import WalletConnectProvider from "@walletconnect/web3-provider";
import constants from "../constants";

const ethers = require("ethers");

class Wallet {
  #_providerType;

  constructor(provider) {
    this.#_providerType = provider;
  }

  async connect() {
    switch (this.#_providerType) {
      case constants.METAMASK_PROVIDER:
        return await this.#_providerFromMetamask();
      case constants.COINBASE_PROVIDER:
        return await this.#_providerFromCoinbase();
      case constants.WALLET_CONNECT_PROVIDER:
        return await this.#_providerFromWalletConnect();
    }
  }

  #_providerFromMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    return provider;
  };

  #_providerFromCoinbase = async () => {
    const walletLink = new WalletLink({
      appName: "TroFi Marketplace",
      darkMode: false,
    });
    const web3Provider = walletLink.makeWeb3Provider(
      process.env["REACT_APP_CONNECTION_RPC"],
      42
    );
    await web3Provider.enable();
    return new ethers.providers.Web3Provider(web3Provider);
  };

  #_providerFromWalletConnect = async () => {
    const web3Provider = new WalletConnectProvider({
      rpc: process.env["REACT_APP_CONNECTION_RPC"],
    });
    await web3Provider.enable();
    return new ethers.providers.Web3Provider(web3Provider);
  };
}

export default Wallet;
