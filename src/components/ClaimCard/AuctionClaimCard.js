import { Button } from "antd";
import React from "react";
import { claim } from "../../utils/auction-functions";
import { merchantWallets } from "../../utils/queries/dao.query";

class AuctionClaimCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      claimed: false,
      hash: "",
      wallets:null
    };
  }

  componentDidMount = () => {
    this.fetchInfo();
  }

  fetchInfo = async () => {
    const result = await merchantWallets(this.props.data.creator);
    this.setState({wallets: result.wallets});
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
    const { buttonLoading, claimed, hash, wallets} = this.state;
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
          <p>
            OutStanding Amount
            <br />
            <span className="special-text">
              BTC {(data.highestBid - data.amountPaid) / 10 ** 8}
            </span>
          </p>
          <p>
            Settlement Wallets
            <br />
            <span>BTC: {wallets && wallets.btcWallet}</span>
            <br />
            <span>ETH: {wallets && wallets.ethWallet}</span>
            <br />
            <span>BNB: {wallets && wallets.bscWallet}</span>
          </p>
        </div>
        {data.isSettled ? (
          <h1 style={{ color: "#28cd88" }}>SETTLED PRODUCT</h1>
        ) : data.paymentHash || claimed ? (
          <h1 style={{ color: "#28cd88" }}>UNDER VERIFICATION</h1>
        ) : Date.now() / 1000 > data.ends ? (
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
          <h1>AUCTION NOT ENDED</h1>
        )}
      </div>
    );
  }
}

export default AuctionClaimCard;
