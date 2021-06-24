import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import { approve } from "../utils/nft-functions";

class Approve extends React.Component {
  constructor(props) {
    super(props);
    this.state = { buttonLoading: false };
  }

  approve() {
    this.setState({ buttonLoading: true }, () => {
      this.setState({ buttonLoading: true }, async () => {
        const tx = await approve(this.props.signer);
        if (!tx.error) {
          this.setState({ buttonLoading: false });
          this.props.approve();
        } else {
          this.setState({ buttonLoading: false });
        }
      });
    });
  }

  render() {
    const { buttonLoading } = this.state;
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
        <Button
          className="primary-button mt-20"
          loading={buttonLoading}
          onClick={() => this.approve()}
        >
          Approve Now
        </Button>
      </div>
    );
  }
}

export default withRouter(Approve);
