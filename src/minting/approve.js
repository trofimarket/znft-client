import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import { approveAuction, approveToptime } from "../utils/nft-functions";

class Approve extends React.Component {
  constructor(props) {
    super(props);
    this.state = { buttonLoading: false, buttonLoading1: false };
  }

  approve(type) {
    this.setState(
      {
        buttonLoading: type === "auction",
        buttonLoading1: type === "toptime",
      },
      async () => {
        if (type === "auction") {
          const tx = await approveAuction(this.props.signer);
          if (!tx.error) {
            this.setState({ buttonLoading: false });
            this.props.approve(type);
          } else {
            this.setState({ buttonLoading: false });
          }
        } else {
          const tx = await approveToptime(this.props.signer);
          if (!tx.error) {
            this.setState({ buttonLoading1: false });
            this.props.approve(type);
          } else {
            this.setState({ buttonLoading1: false });
          }
        }
      }
    );
  }

  render() {
    const { buttonLoading, buttonLoading1 } = this.state;
    const { status, status1 } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>
          You should approve the NFT marketplace contract to spend you NFTs. You
          can revoke your access anytime later. To Proceed with, please approve
          your NFTs. To approve just click on the button below
        </p>
        {status ? (
          <h1 style={{ color: "#28cd88" }}>AUCTION APPROVED</h1>
        ) : (
          <Button
            className="primary-button mt-20"
            loading={buttonLoading}
            onClick={() => this.approve("auction")}
          >
            Approve Auction
          </Button>
        )}
        {status1 ? (
          <h1 style={{ color: "#28cd88" }} className="mt-20">
            TOPTIME APPROVED
          </h1>
        ) : (
          <Button
            className="primary-button mt-20"
            loading={buttonLoading1}
            onClick={() => this.approve("toptime")}
          >
            Approve TopTime
          </Button>
        )}
      </div>
    );
  }
}

export default withRouter(Approve);
