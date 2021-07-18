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
import MarketPlace from "./marketplace/MarketPlace";
import AuctionInfo from "./marketplace/auction";
import TopTimeInfo from "./marketplace/toptime";
import MerchantInfo from "./marketplace/merchantInfo";
import Profile from "./profile/index";
import Home from "./static/Home";
import "../src/App.css";
import { notify } from "./utils/general-functions";
import AuctionDetail from "./marketplace/AuctionDetail";
import Distribution from "./dao/Distribution";
import CreateDistribution from "./dao/CreateDistribution";

const ethers = require("ethers");

const walletLink = new WalletLink({
  appName: "TroFi Marketplace",
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
        const network = await provider.getNetwork();
        if (network.chainId !== 42) {
          notify(
            "error",
            "Wrong Network Detected",
            "Please connect with kovan testnet",
            null
          );
          this.setState({ connecting: false });
        } else {
          const signer = await provider.getSigner();
          this.setState({
            address: address[0],
            signer: signer,
            connected: true,
            modal: false,
            connecting: false,
          });
        }
      }
    } catch (e) {
      // Error Logs
    }
  };

  walletconnect = async () => {
    try {
      const web3Provider = new WalletConnectProvider({
        rpc: process.env.REACT_APP_CONNECTION_RPC,
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
        process.env.REACT_APP_CONNECTION_RPC,
        42
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
      <div className="container mx-auto">
        <Navbar open={this.open} connected={connected} address={address} />
        <ConnectModal
          modal={modal}
          cancel={this.cancel}
          connect={this.connect}
          connecting={connecting}
          connected={connected}
          address={address}
          disconnect={this.disconnect}
        />
        <div className="page-div">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  signer={signer}
                  address={address}
                  open={this.open}
                  connected={connected}
                />
              )}
            />
            <Route
              exact
              path="/create"
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
              path="/distribution/create"
              render={() => (
                <CreateDistribution
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
            {/*<Route*/}
            {/*    exact*/}
            {/*    path="/marketplace"*/}
            {/*    render={() => (*/}
            {/*        <MarketPlace*/}
            {/*            signer={signer}*/}
            {/*            address={address}*/}
            {/*            connected={connected}*/}
            {/*            open={this.open}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}
            <Route
              exact
              path="/marketplace"
              render={() => (
                <MarketPlace
                  signer={signer}
                  address={address}
                  connected={connected}
                  open={this.open}
                />
              )}
            />
            {/*<Route*/}
            {/*    exact*/}
            {/*    path="/auction/:auctionId"*/}
            {/*    render={() => (*/}
            {/*        <AuctionInfo*/}
            {/*            signer={signer}*/}
            {/*            address={address}*/}
            {/*            connected={connected}*/}
            {/*            open={this.open}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}
            <Route
              exact
              path="/auction/:auctionId"
              render={() => (
                <AuctionDetail
                  signer={signer}
                  address={address}
                  connected={connected}
                  open={this.open}
                />
              )}
            />
            <Route
              exact
              path="/toptime/:toptimeId"
              render={() => (
                <TopTimeInfo
                  signer={signer}
                  address={address}
                  connected={connected}
                  open={this.open}
                />
              )}
            />
            <Route
              exact
              path="/merchant/:address"
              render={() => <MerchantInfo />}
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
            <Route
              exact
              path="/distribution/:id"
              render={() => (
                <Distribution
                  signer={signer}
                  address={address}
                  connected={connected}
                  open={this.open}
                />
              )}
            />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}
