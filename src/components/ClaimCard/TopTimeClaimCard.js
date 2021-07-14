import { Button } from "antd";
import React from "react";
import { claim } from "../../utils/toptime-functions";

class TopTimeClaimCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      claimed: false,
      hash: "",
    };
  }

  claim = () => {
    this.setState({ buttonLoading: true }, async () => {
      const tx = await claim(
        this.props.data.id,
        this.state.hash,
        this.props.signer
      );
      if (!tx.error) {
        this.setState({ buttonLoading: false, claimed: true });
      } else {
        this.setState({ buttonLoading: false });
      }
    });
  };

  render() {
    const { data } = this.props;
    const { buttonLoading, claimed, hash } = this.state;
    const time =
      parseFloat(data.toptime) -
      (Date.now() / 1000 - parseFloat(data.highestBidAt));
    return (
      <div className="nft-card">
        <h1>
          # {data.id} <span style={{ fontSize: "1.0rem" }}>Auction Id</span>
        </h1>
        <div>
          <p>
            Bid Amount
            <br />
            <span className="special-text">
              BTC {data.highestBid / 10 ** 8}
            </span>
          </p>
        </div>
        {data.isSettled ? (
          <h1 style={{ color: "#28cd88" }}>SETTLED PRODUCT</h1>
        ) : claimed || data.paymentHash ? (
          <h1 style={{ color: "#28cd88" }}>UNDER VERIFICATION</h1>
        ) : time < 0 ? (
          <>
            <input
              value={hash}
              placeholder="Your Payment Hash With Explorer Link"
              onChange={(e) => {
                this.setState({ hash: e.target.value });
              }}
            />
            <Button
              className="primary-button mt-20"
              onClick={() => {
                this.claim();
              }}
              loading={buttonLoading}
            >
              SUBMIT VERIFICATION
            </Button>
          </>
        ) : (
          <h1>TOP TIME IN {parseInt(time)} Secs</h1>
        )}
      </div>
    );
  }
}

export default TopTimeClaimCard;
