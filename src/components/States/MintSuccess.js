import React from "react";
import Lottie from "react-lottie";
import { Button } from "antd";
import animationData from "../../assets/lottie-files/success-state.json";
import { withRouter } from "react-router";

class Success extends React.Component {
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
      <div>
        <div className="mt-40">
          <h1>Token Creation Successful</h1>
          <p>
            Now your list your token for sale and start monetizing it. For
            listing switch to the `List NFT for Sale` tab.
          </p>
          <Lottie options={defaultOptions} height={400} width="100%" />
          <Button
            onClick={() => {
              this.props.reset();
            }}
            className="primary-button mt-40"
          >
            Mint Another
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Success);
