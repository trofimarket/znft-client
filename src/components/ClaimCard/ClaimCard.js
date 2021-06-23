import { Button } from "antd";
import React from "react";
import { claim } from "../../utils/auction-functions";

class ClaimCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
    };
  }

  claim = () => {
    this.setState({ buttonLoading: true }, async () => {
      const tx = await claim(this.props.data.id, this.props.signer);
      console.log(tx);
      this.setState({ buttonLoading: false });
    });
  };

  render() {
    const { data } = this.props;
    const { buttonLoading } = this.state;
    return (
      <div>
        <h1>Auction Id: {data.id}</h1>
        <p>Listing Price: {data.listingPrice}</p>
        <p>Highest Bid: {data.highestBid}</p>
        {Date.now() / 1000 > data.ends ? (
          <Button
            onClick={() => {
              this.claim();
            }}
            loading={buttonLoading}
          >
            Claim My NFT
          </Button>
        ) : null}
      </div>
    );
  }
}

export default ClaimCard;
