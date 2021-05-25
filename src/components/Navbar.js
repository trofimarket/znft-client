import { Drawer } from "antd";
import React from "react";
import { Burger } from "../assets/Burger";
import { Close } from "../assets/Close";
import "./Navbar.css";

export default class Navbar extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      sidebarVisible: false,
    };
  }

  toggleSidebar = () => {
    this.setState((state) => {
      return {
        sidebarVisible: !state.sidebarVisible,
      };
    });
  };

  render() {
    const { sidebarVisible } = this.state;
    const { open, connected, address } = this.props;
    return (
      <div className="navbar-wrapper">
        <div className="navbar-container">
          <div className="navbar-logo">
            <h1>ZNFT</h1>
          </div>
          <div className="secondary-div">
            <div>
              <ul className="navbar-elements">
                <li>NFT Marketplace</li>
                <li>List My Company</li>
                <li>Developers</li>
                <li>About Us</li>
                <li>Docs</li>
              </ul>
            </div>
            <div>
              {connected ? (
                <button
                  type="button"
                  className="connect-button"
                  onClick={() => {
                    open();
                  }}
                >
                  {address.slice(0, 6) + "....." + address.slice(38, 42)}
                </button>
              ) : (
                <button
                  type="button"
                  className="connect-button"
                  onClick={() => {
                    open();
                  }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
            <button className="burger" onClick={this.toggleSidebar}>
              <Burger />
            </button>
          </div>
        </div>
        <Drawer
          visible={sidebarVisible}
          onClose={this.toggleSidebar}
          maskClosable
          closable
          closeIcon={<Close />}
          className="sidebar"
        >
          <ul className="navbar-elements">
            <li>Markets</li>
            <li>Governance</li>
            <li>Developers</li>
            <li>Prices</li>
            <li>Docs</li>
          </ul>
        </Drawer>
      </div>
    );
  }
}
