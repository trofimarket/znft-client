import { Drawer } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Burger from "../../assets/icn-burger.svg";
import { Close } from "../../assets/Close";
import "./Navbar.css";

class Navbar extends React.PureComponent {
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
          <div
            className="navbar-logo"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            <h1>TroFi</h1>
          </div>
          <div className="secondary-div">
            <div className="mobile">
              <ul className="navbar-elements">
                <li
                  onClick={() => {
                    this.props.history.push("/marketplace");
                  }}
                >
                  Marketplace
                </li>
                <li
                  onClick={() => {
                    this.props.history.push("/create");
                  }}
                >
                  For Companies
                </li>
                <li
                  onClick={() => {
                    this.props.history.push("/proposals");
                  }}
                >
                  For Share Holders
                </li>
                <li
                  onClick={() => {
                    this.props.history.push("/mint");
                  }}
                >
                  Tokenize Assets
                </li>
                <li
                  onClick={() => {
                    this.props.history.push("/profile");
                  }}
                >
                  My Profile
                </li>
              </ul>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
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
              <button
                type="button"
                className="burger"
                onClick={this.toggleSidebar}
              >
                <img src={Burger} alt="menu" />
              </button>
            </div>
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
            <li
              onClick={() => {
                this.props.history.push("/marketplace");
              }}
            >
              Marketplace
            </li>
            <li
              onClick={() => {
                this.props.history.push("/create");
              }}
            >
              For Companies
            </li>
            <li
              onClick={() => {
                this.props.history.push("/proposals");
              }}
            >
              For Share Holders
            </li>
            <li
              onClick={() => {
                this.props.history.push("/mint");
              }}
            >
              Tokenize Assets
            </li>
            <li
              onClick={() => {
                this.props.history.push("/profile");
              }}
            >
              My Profile
            </li>
          </ul>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(Navbar);