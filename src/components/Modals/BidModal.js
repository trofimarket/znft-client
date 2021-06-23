import React from "react";
import { Button, Modal } from "antd";
import { approveToken } from "../../utils/payment-functions";
import { bid } from "../../utils/auction-functions";

class BidModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: "ETH",
      amount: "0.01",
      bidAmount: "",
    };
  }

  approve() {
    const { asset, amount } = this.state;
    const tx = approveToken(asset, amount, this.props.signer);
    console.log(tx);
  }

  bid() {
    const { auctionId } = this.props;
    const { asset, bidAmount } = this.state;

    const tx = bid(asset, bidAmount * 10 ** 8, auctionId, this.props.signer);
    console.log(tx);
  }

  render() {
    const { visible, toggleModal, auctionId, price } = this.props;
    const { asset, bidAmount } = this.state;
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
        <p>Price in USD: {price}</p>
        <p>Asset: {asset}</p>
        <input
          name="bidAmount"
          placeholder="Bid Amount in USD"
          onChange={(e) => this.setState({ bidAmount: e.target.value })}
          value={bidAmount}
        />
        <br />
        <br />
        <Button
          onClick={() => {
            this.approve();
          }}
        >
          Approve Tokens
        </Button>
        <Button
          onClick={() => {
            this.bid();
          }}
        >
          Bid Now
        </Button>
      </Modal>
    );
  }
}

export default BidModal;
