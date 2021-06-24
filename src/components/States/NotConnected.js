import { Button } from "antd";
import React from "react";
import Lottie from "react-lottie";
import { withRouter } from "react-router";
import animationData from "../../assets/lottie-files/not-connected.json";

class NotConnected extends React.Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie options={defaultOptions} />
        <Button
          onClick={() => {
            this.props.open();
          }}
          className="primary-button mt-40"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }
}

export default withRouter(NotConnected);
