import React from "react";
import { Modal, Spin, Button } from "antd";
import Metamask from "../../assets/icn-metamask.svg";
import WalletConnect from "../../assets/icn-wallet-connect.svg";
import CoinbaseWallet from "../../assets/icn-coinbase-wallet.svg";
import Arrow from "../../assets/icn-build-arrows-green.svg";
import "./WalletConnect.css";

export default class ConnectModal extends React.PureComponent {
  render() {
    const {
      modal,
      cancel,
      connecting,
      connect,
      connected,
      disconnect,
      address,
    } = this.props;
    return (
      <Modal
        visible={modal}
        footer={false}
        centered
        onCancel={() => {
          cancel();
        }}
      >
        {connected ? (
          <div className="modal-container">
            <h2>Wallet Connected</h2>
            <div className="connected-container">
              <p>
                {String(address).substring(0, 10) +
                  "............." +
                  String(address).substring(
                    address.length - 10,
                    address.length
                  )}
              </p>{" "}
              {/* <a href={`https://kovan.etherscan.io/address/${address}`}>
                View on Explorer
              </a> */}
            </div>
            <Button
              className="disconnect-wallet"
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : !connecting ? (
          <div className="modal-container">
            <h2>Connect Wallet</h2>
            <p>To start using the TroFi Marketplace</p>
            <div className="connect-container">
              <div
                role="button"
                tabIndex={-1}
                className="connect-item"
                onClick={() => {
                  connect("metamask");
                }}
                onKeyDown={() => {
                  connect();
                }}
              >
                <img src={Metamask} alt="metamask-logo" />
                <h1>Metamask</h1>
                <img src={Arrow} alt="right-arrow" />
              </div>
              <div
                role="button"
                tabIndex={-2}
                className="connect-item"
                onClick={() => {
                  connect("walletconnect");
                }}
                onKeyDown={() => {
                  connect();
                }}
              >
                <img src={WalletConnect} alt="metamask-logo" />
                <h1>Wallet Connect</h1>
                <img src={Arrow} alt="right-arrow" />
              </div>
              <div
                role="button"
                tabIndex={-3}
                className="connect-item"
                onClick={() => {
                  connect("coinbase");
                }}
                onKeyDown={() => {
                  connect();
                }}
              >
                <img src={CoinbaseWallet} alt="metamask-logo" />
                <h1>Coinbase Wallet</h1>
                <img src={Arrow} alt="right-arrow" />
              </div>
            </div>
            <p className="warning-text">
              By continuing, I accept the terms of use
            </p>
          </div>
        ) : (
          <div className="modal-container">
            <h2>Unlock Wallet</h2>
            <div className="spinner-container">
              <Spin size="large" />
            </div>
            <p className="warning-text">Click on your wallet to connect</p>
          </div>
        )}
      </Modal>
    );
  }
}