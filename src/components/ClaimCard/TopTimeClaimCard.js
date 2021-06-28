import { Button } from "antd";
import React from "react";
import { claim } from "../../utils/toptime-functions";

class TopTimeClaimCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      claimed: false,
    };
  }

  claim = () => {
    this.setState({ buttonLoading: true }, async () => {
      const tx = await claim(this.props.data.id, this.props.signer);
      if (!tx.error) {
        this.setState({ buttonLoading: false, claimed: true });
      } else {
        this.setState({ buttonLoading: false });
      }
    });
  };

  render() {
    const { data } = this.props;
    const { buttonLoading, claimed } = this.state;
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
            Listing Price <br />
            <span className="special-text">
              USD {data.listingPrice / 10 ** 8}
            </span>
          </p>
          <p>
            Highest Bid
            <br />
            <span className="special-text">
              USD {data.highestBid / 10 ** 8}
            </span>
          </p>
        </div>
        {data.isSettled || claimed ? (
          <h1 style={{ color: "#28cd88" }}>CLAIMED</h1>
        ) : time < 0 ? (
          <Button
            className="primary-button"
            onClick={() => {
              this.claim();
            }}
            loading={buttonLoading}
          >
            Claim My NFT
          </Button>
        ) : (
          <h1>TOP TIME IN {parseInt(time)} Secs</h1>
        )}
      </div>
    );
  }
}

export default TopTimeClaimCard;
