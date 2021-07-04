import React from "react";
import { Button, Modal, Select } from "antd";
import {
  allowanceToken,
  approveToken,
  balanceToken,
} from "../../utils/payment-functions";
import { bidAuction, estimate } from "../../utils/auction-functions";
import { notify } from "../../utils/general-functions";
import { auctionInfo } from "../../utils/queries/auction.query";
import { bidTopTime } from "../../utils/toptime-functions";
import { toptimeInfo } from "../../utils/queries/toptime.query";

const { Option } = Select;

const Logos = {
  ETH: {
    url: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  },
  BTC: {
    url: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
  },
};

class BidModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: "ETH",
      bidAmount: "",
      approved: false,
      approveLoading: false,
      estimate: "",
      estimated: false,
      estimating: false,
      biddingLoading: false,
    };
  }

  approve() {
    this.setState({ approveLoading: true }, async () => {
      const { asset, estimate } = this.state;
      const tx = await approveToken(
        asset,
        estimate,
        this.props.type,
        this.props.signer
      );
      if (tx.error) {
        this.setState({ approveLoading: false });
      } else {
        this.setState({ approveLoading: false, approved: true });
      }
    });
  }

  bid() {
    this.setState({ biddingLoading: true }, async () => {
      const { auctionId } = this.props;
      const { asset, bidAmount, estimate } = this.state;
      let info;
      if (this.props.type === "auction") {
        info = await auctionInfo(auctionId);
      } else {
        info = await toptimeInfo(auctionId);
      }
      const balance = await balanceToken(this.state.asset, this.props.address);
      if (parseFloat(info[0].highestBid) > parseFloat(bidAmount * 10 ** 8)) {
        notify(
          "warning",
          "Bid higher amount",
          "A bidder placed bid for higher amount than yours",
          null
        );
        this.setState({ biddingLoading: false });
        this.props.fetchInfo(auctionId);
      } else if (parseFloat(balance.balance) < parseFloat(estimate)) {
        notify(
          "warning",
          "Insufficient Balance",
          `Please check whether your wallet has sufficient ${asset} balance `,
          null
        );
        this.setState({ biddingLoading: false });
      } else {
        let result;
        if (this.props.type === "auction") {
          result = await bidAuction(
            asset,
            bidAmount,
            auctionId,
            this.props.signer
          );
        } else {
          result = await bidTopTime(
            asset,
            bidAmount,
            auctionId,
            this.props.signer
          );
        }
        if (result.error) {
          this.setState({ biddingLoading: false });
        } else {
          this.setState({ biddingLoading: false });
          this.props.toggleModal();
          this.props.fetchBids(auctionId);
          this.props.fetchInfo(auctionId);
        }
      }
    });
  }

  async amountChange(e) {
    this.setState({
      bidAmount: e.target.value,
    });
    if (parseFloat(e.target.value) > 0) {
      this.setState({
        estimated: false,
        estimating: true,
      });
      const eAmount = await estimate(this.state.asset, e.target.value, 1);
      const approval = await allowanceToken(
        this.state.asset,
        this.props.address,
        this.props.type
      );
      console.log(approval);
      if (!eAmount.error && !approval.error) {
        this.setState({ estimate: eAmount.amount });
        if (parseFloat(approval.approval) >= parseFloat(eAmount.amount)) {
          this.setState({ approved: true, estimated: true, estimating: false });
        } else {
          this.setState({
            approved: false,
            estimated: true,
            estimating: false,
          });
        }
      }
    }
  }

  render() {
    const { visible, toggleModal, auctionId, price } = this.props;
    const {
      asset,
      bidAmount,
      approved,
      approveLoading,
      estimate,
      estimated,
      estimating,
      biddingLoading,
    } = this.state;
    return (
      <Modal
        visible={visible}
        centered
        onCancel={() => {
          toggleModal();
        }}
        footer={false}
      >
        <h1>Bid Now: {auctionId}</h1>
        <div>
          <p>
            Current Price <br />
            <span className="special-text">BTC {price / 10 ** 8}</span>
          </p>
          <p>
            Pay With <br />
            <span className="special-text">
              <img className="coin-icon" src={Logos[asset].url} alt={asset} />{" "}
              {asset}
            </span>
          </p>
        </div>
        <span className="form-label">Bid Info</span>
        <div className="mt-20 ">
          <Select
            defaultValue="ETH"
            onChange={(e) => {
              this.setState({ asset: e });
            }}
          >
            <Option value="ETH">Ethereum</Option>
            <Option value="BTC">Bitcoin</Option>
          </Select>
          <input
            name="bidAmount"
            placeholder="Bid Amount in BTC"
            onChange={(e) => this.amountChange(e)}
            value={bidAmount}
          />
        </div>
        <div className="mt-20 ">
          <span className="form-label">Estimate </span>
          <br />
          <p>
            {estimate ? parseFloat(estimate).toFixed(8) : 0.0} {asset}
          </p>
        </div>
        <div className="mt-20">
          {!estimated ? (
            <Button loading={estimating} className="primary-button" disabled>
              Enter Input Values
            </Button>
          ) : !approved ? (
            <Button
              className="primary-button"
              onClick={() => {
                this.approve();
              }}
              loading={approveLoading}
            >
              Approve Tokens
            </Button>
          ) : (
            <Button
              className="primary-button"
              onClick={() => {
                this.bid();
              }}
              loading={biddingLoading}
            >
              Bid Now
            </Button>
          )}
        </div>
      </Modal>
    );
  }
}

export default BidModal;
