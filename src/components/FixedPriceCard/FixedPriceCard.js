import React from "react";
import { withRouter } from "react-router";
import { FiExternalLink, FiUser } from "react-icons/fi";
import { Button } from "antd";
import { uri } from "../../utils/nft-functions";
import { getFromLink } from "../../utils/ipfs";
import BTC from "../../assets/coin-icons/btc.png";
import FixedPriceModal from "../Modals/FixedPrice";

class FixedPriceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { info: null, visible: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  async componentDidMount() {
    const { data } = this.props;
    const hash = await uri(data.tokenId);
    const info = await getFromLink(hash.uri);
    this.setState({ info });
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { data, connected } = this.props;
    const { info, visible } = this.state;
    return (
      <div className="auction-card">
        {info && info.cover ? (
          <img src={`https://ipfs.trofi.one/ipfs/${info.cover}`} alt={info.cover} />
        ) : (
          <h1># TOKEN ID {data.tokenId}</h1>
        )}
        <div>
          <p className="mt-20">
            Sale Price
            <span
              className="special-text"
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "0.3rem",
              }}
            >
              <img src={BTC} style={{ width: "25px", marginRight: "0.3rem" }} />
              {"  "}
              {data.price / 10 ** 8}
            </span>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
          className="mt-20"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Creation Hash</p>
            <FiExternalLink
              className="external-link"
              onClick={() => {
                window.open(
                  `https://kovan.etherscan.io/tx/${data.creationHash}`
                );
              }}
              size={30}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Creator</p>
            <FiUser
              className="external-link"
              onClick={() => {
                this.props.history.push(`/merchant/${data.creator}`);
              }}
              size={30}
            />
          </div>
          {data.settlementHash ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>Settlement Hash</p>
              <FiExternalLink
                className="external-link"
                onClick={() => {
                  window.open(
                    `https://kovan.etherscan.io/tx/${data.settlementHash}`
                  );
                }}
                size={30}
              />
            </div>
          ) : null}
        </div>
        {data.settlementHash ? (
          <h1
            className="mt-20"
            style={{ textAlign: "center", color: "#28cd88" }}
          >
            SALE ENDED
          </h1>
        ) : (
          <Button
            className="primary-button mt-40"
            onClick={() => {
              connected ? this.toggleModal() : this.props.open();
            }}
          >
            Buy Now
          </Button>
        )}
        <FixedPriceModal
          visible={visible}
          toggleModal={this.toggleModal}
          saleId={data.saleId}
          price={data.price}
          type="fixedprice"
          address={this.props.address}
          signer={this.props.signer}
        />
      </div>
    );
  }
}

export default withRouter(FixedPriceCard);