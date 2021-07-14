import { Button } from "antd";
import React from "react";
import { settle } from "../../utils/auction-functions";

class AuctionSettlementCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      settled: false,
    };
  }

  settle = () => {
    this.setState({ buttonLoading: true }, async () => {
      const tx = await settle(this.props.data.id, this.props.signer);
      if (!tx.error) {
        this.setState({ buttonLoading: false, settled: true });
      } else {
        this.setState({ buttonLoading: false });
      }
    });
  };

  render() {
    const { data } = this.props;
    const { buttonLoading, settled } = this.state;
    return (
      <div className="nft-card">
        <h1>
          # {data.id} <span style={{ fontSize: "1.0rem" }}>Auction Id</span>
        </h1>
        <div>
          <p>
            Sale Value
            <br />
            <span className="special-text">
              BTC {data.highestBid / 10 ** 8}
            </span>
          </p>
          <p>
            Settlement Hash
            <br />
            {data.paymentHash ? (
              <a href={data.paymentHash} target="_blank" rel="noreferrer">
                Click Here
              </a>
            ) : (
              <p>USER PAYMENT NOT MADE</p>
            )}
          </p>
        </div>
        {data.isSettled || settled ? (
          <h1 style={{ color: "#28cd88" }}>SETTLED PRODUCT</h1>
        ) : Date.now() / 1000 > data.ends ? (
          <>
            <Button
              className="primary-button mt-20"
              onClick={() => {
                this.settle();
              }}
              loading={buttonLoading}
              disabled={!data.paymentHash}
            >
              SETTLE SALE
            </Button>
          </>
        ) : (
          <h1>AUCTION NOT ENDED</h1>
        )}
      </div>
    );
  }
}

export default AuctionSettlementCard;
