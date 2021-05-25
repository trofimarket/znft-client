import React from "react";
import { Modal, Spin } from "antd";
import Metamask from "../../assets/icn-metamask.svg";
import WalletConnect from "../../assets/icn-wallet-connect.svg";
import CoinbaseWallet from "../../assets/icn-coinbase-wallet.svg";
import Arrow from "../../assets/icn-build-arrows-green.svg";
import "./WalletConnect.css";

export default class ConnectModal extends React.PureComponent {
  render() {
    const { modal, cancel, connecting, connect, connected, disconnect } =
      this.props;
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
            <h3>Wallet Connected</h3>
            <p>You can switch wallet anytime</p>
            <button
              type="secondary"
              className="disconnect-wallet"
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : !connecting ? (
          <div className="modal-container">
            <h3>Connect Wallet</h3>
            <p>To start using ZNFT Marketplace</p>
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
            <p>By continuing, I accept the terms of use</p>
          </div>
        ) : (
          <div className="modal-container">
            <h3>Unlock Wallet</h3>
            <p>You may need to click the extension.</p>
            <div className="spinner-container">
              <Spin size="large" />
            </div>
            <p>By continuing, I accept the terms of use</p>
          </div>
        )}
      </Modal>
    );
  }
}
