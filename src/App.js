import React from "react";
import { Route, Switch } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ConnectModal from "./components/Modals/WalletConnect";
import WalletLink from "walletlink";
import CreateMerchant from "./dao/CreateMerchant";
import Proposals from "./dao/Proposals";
import Index from "./minting/index";
import Marketplace from "./marketplace/list";
import AuctionInfo from "./marketplace/auction";
import Profile from "./profile/profile";
import "../src/App.css";

const ethers = require("ethers");

const walletLink = new WalletLink({
  appName: "ZNFT Marketplace",
  darkMode: false,
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      signer: null, // Singer required for transaction - Provider will open up a signer
      connecting: false,
      address: "",
      connected: false,
    };
    this.connect = this.connect.bind(this);
    this.cancel = this.cancel.bind(this);
    this.open = this.open.bind(this);
    this.metamask = this.metamask.bind(this);
    this.walletconnect = this.walletconnect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.coinbase = this.coinbase.bind(this);
  }

  componentDidMount = () => {};

  open = () => {
    this.setState({
      modal: true,
    });
  };

  cancel = () => {
    this.setState({
      modal: false,
      connecting: false,
    });
  };

  connect = (type) => {
    this.setState({
      connecting: true,
    });
    if (type === "metamask") {
      this.metamask();
    } else if (type === "walletconnect") {
      this.walletconnect();
    } else if (type === "coinbase") {
      this.coinbase();
    }
  };

  disconnect = () => {
    this.setState({
      connected: false,
      connecting: false,
      address: "",
    });
    localStorage.clear();
    walletLink.disconnect();
  };

  metamask = async () => {
    try {
      if (window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const address = await provider.listAccounts();
        //  let network = await provider.getNetwork();
        const signer = await provider.getSigner();
        this.setState({
          address: address[0],
          signer: signer,
          connected: true,
          modal: false,
        });
      }
    } catch (e) {
      // Error Logs
    }
  };

  walletconnect = async () => {
    try {
      const web3Provider = new WalletConnectProvider({
        rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      });
      await web3Provider.enable().catch((e) => {
        // Connection Error Handler
        this.setState({
          connecting: false,
        });
        console.log(e);
      });
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const address = await provider.listAccounts();
      const signer = provider.getSigner();
      this.setState({
        address: address[0],
        signer: signer,
        connected: true,
        connecting: false,
        modal: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  coinbase = async () => {
    try {
      const web3Provider = walletLink.makeWeb3Provider(
        "https://data-seed-prebsc-1-s1.binance.org:8545/",
        97
      );
      await web3Provider.enable().catch((e) => {
        // Connection Error Handler
        this.setState({
          connecting: false,
          connected: false,
        });
        console.log(e);
      });
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const address = await provider.listAccounts();
      const signer = provider.getSigner();
      if (address.length > 0) {
        this.setState({
          address: address[0],
          signer: signer,
          connected: true,
          connecting: false,
          modal: false,
        });
      }
    } catch (e) {
      // Handle Error
    }
  };

  render() {
    const { modal, signer, connecting, connected, address } = this.state;
    return (
      <div className="container">
        <Navbar open={this.open} connected={connected} address={address} />
        <ConnectModal
          modal={modal}
          cancel={this.cancel}
          connect={this.connect}
          connecting={connecting}
          connected={connected}
          disconnect={this.disconnect}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <CreateMerchant
                signer={signer}
                address={address}
                open={this.open}
                connected={connected}
              />
            )}
          />
          <Route
            exact
            path="/proposals"
            render={() => (
              <Proposals
                signer={signer}
                address={address}
                connected={connected}
                open={this.open}
              />
            )}
          />
          <Route
            exact
            path="/mint"
            render={() => (
              <Index
                signer={signer}
                address={address}
                connected={connected}
                open={this.open}
              />
            )}
          />
          <Route
            exact
            path="/marketplace"
            render={() => (
              <Marketplace
                signer={signer}
                address={address}
                connected={connected}
                open={this.open}
              />
            )}
          />
          <Route
            exact
            path="/auction/:auctionId"
            render={() => (
              <AuctionInfo
                signer={signer}
                address={address}
                connected={connected}
                open={this.open}
              />
            )}
          />
          <Route
            exact
            path="/profile/"
            render={() => (
              <Profile
                signer={signer}
                address={address}
                connected={connected}
                open={this.open}
              />
            )}
          />
        </Switch>
        <Footer />
      </div>
    );
  }
}
