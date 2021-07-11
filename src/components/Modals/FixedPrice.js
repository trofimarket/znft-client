import React from "react";
import { Button, Modal, Select } from "antd";
import {
  allowanceToken,
  approveToken,
  balanceToken,
} from "../../utils/payment-functions";
import { estimate } from "../../utils/auction-functions";
import { notify } from "../../utils/general-functions";
import { buyFixedPriceSale } from "../../utils/fixedprice-functions";

const { Option } = Select;

const Logos = {
  ETH: {
    url: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  },
  BTC: {
    url: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
  },
};

class FixedPriceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: "ETH",
      approved: false,
      approveLoading: false,
      estimate: "",
      estimated: false,
      estimating: false,
      buyLoading: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.connected) {
      this.estimate();
    }
  };

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

  buy() {
    this.setState({ buyLoading: true }, async () => {
      const { estimate, asset } = this.state;
      const { saleId, signer } = this.props;
      const balance = await balanceToken(this.state.asset, this.props.address);
      if (parseFloat(balance) < parseFloat(estimate)) {
        notify(
          "warning",
          "insufficient balance",
          "you don't have enough funds to buy",
          null
        );
      } else {
        const tx = buyFixedPriceSale(saleId, asset, signer);
        if (tx.hash) {
          this.setState({ buyLoading: false });
          this.props.toggleModal();
        } else {
          this.setState({ buyLoading: false });
        }
      }
    });
  }

  estimate() {
    this.setState({ estimating: true }, async () => {
      const eAmount = await estimate(
        this.state.asset,
        String(this.props.price / 10 ** 8),
        1
      );
      this.setState({ estimate: eAmount.amount });
      const approval = await allowanceToken(
        this.state.asset,
        this.props.address,
        this.props.type
      );
      console.log(approval);
      if (!eAmount.error && !approval.error) {
        if (parseFloat(approval.approval) >= parseFloat(eAmount.amount)) {
          this.setState({ approved: true, estimated: true, estimating: false });
        } else {
          this.setState({
            estimating: false,
            approved: false,
            estimated: true,
          });
        }
      }
    });
  }

  render() {
    const { visible, toggleModal, saleId, price } = this.props;
    const {
      asset,
      approved,
      approveLoading,
      estimate,
      estimated,
      estimating,
      buyLoading,
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
        <h1>Buy Now: {saleId}</h1>
        <div>
          <p>
            Sale Price <br />
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
        <span className="form-label">Select Asset</span>
        <div className="mt-20 ">
          <Select
            defaultValue="ETH"
            onChange={(e) => {
              this.setState({ asset: e });
              this.estimate();
            }}
          >
            <Option value="ETH">Ethereum</Option>
            <Option value="BTC">Bitcoin</Option>
          </Select>
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
                this.buy();
              }}
              loading={buyLoading}
            >
              Buy Now
            </Button>
          )}
        </div>
      </Modal>
    );
  }
}

export default FixedPriceModal;
