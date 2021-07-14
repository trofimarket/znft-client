// import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import BidModal from "../components/Modals/BidModal";
import NftSimpleCard from "../components/NftCard/NftSimpleCard";
import { auctionInfo, bids } from "../utils/queries/auction.query";
import { FiExternalLink, FiUser, FiDollarSign } from "react-icons/fi";
import Countdown from "react-countdown";
import { notify } from "../utils/general-functions";
import BTC from "../assets/coin-icons/btc.png";

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <h1 className="special-text" style={{ color: "#28cd88" }}>
        SALE ENDED
      </h1>
    );
  } else {
    // Render a countdown
    return (
      <span className="special-text" style={{ color: "#28cd88" }}>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
};

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      bids: null,
      visible: false,
      fetchingBids: true,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.fetchBids = this.fetchBids.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
  }

  async componentDidMount() {
    const { auctionId } = this.props.match.params;
    this.fetchInfo(auctionId);
    this.fetchBids(auctionId);
  }

  async fetchInfo(auctionId) {
    const info = await auctionInfo(auctionId);
    this.setState({
      info: info[0],
    });
  }

  async fetchBids(auctionId) {
    const bidInfo = await bids(auctionId);
    this.setState({
      bids: bidInfo,
      fetchingBids: false,
    });
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { info, visible, bids } = this.state;
    return info !== null ? (
      <div>
        <div className="auction-grid">
          <div className="auction-info">
            <h1>Auction Id : {info.id}</h1>
            <Countdown date={new Date(info.ends * 1000)} renderer={renderer} />
            <p>
              Sold By <br />
              <span className="special-text">
                {String(info.creator).substring(0, 10) +
                  "......." +
                  String(info.creator).substring(
                    info.creator.length - 10,
                    info.creator.length
                  )}
              </span>
            </p>
            <p>
              Current Price <br />
              <span className="special-text">
                <img
                  src={BTC}
                  style={{ width: "25px", marginRight: "0.3rem" }}
                />
                {info.highestBid / 10 ** 8 || info.listingPrice / 10 ** 8}
              </span>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
              className="mt-40"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>Creation</p>
                <FiExternalLink
                  className="external-link"
                  onClick={() => {
                    window.open(
                      `https://kovan.etherscan.io/tx/${info.creationHash}`
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
                <p>Bid Now</p>
                <FiDollarSign
                  className="external-link"
                  onClick={() => {
                    info.ends * 1000 > Date.now()
                      ? this.props.connected
                        ? this.toggleModal()
                        : this.props.open()
                      : notify(
                        "warning",
                        "Sale Ended",
                        "The auction has already been closed",
                        null
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
                    window.open(`/merchant/${info.creator}`);
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
                <p>Settlement</p>
                <FiExternalLink
                  className="external-link"
                  onClick={() => {
                    info.isSettled
                      ? window.open(
                        `https://kovan.etherscan.io/tx/${info.settlementHash}`
                      )
                      : notify(
                        "warning",
                        "Not Yet Settled",
                        "You can settle bids in your profile page",
                        null
                      );
                  }}
                  size={30}
                />
              </div>
            </div>
          </div>
          <div>
            <NftSimpleCard data={info} />
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <td>Bidder</td>
                <td>Currency</td>
                <td>Paid</td>
                <td>Total Bid</td>
                <td>Hash</td>
              </tr>
            </thead>
            <tbody>
              {bids !== null
                ? bids.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        href={`https://kovan.etherscan.io/address/${data.bidder}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {data.bidder}
                      </a>
                    </td>
                    <td>{data.currency}</td>
                    <td>{data.paid / 10 ** 8} BTC</td>
                    <td>{data.amount / 10 ** 8} BTC</td>
                    <td>
                      <a
                        href={`https://kovan.etherscan.io/tx/${data.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {data.id}
                      </a>
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
        <BidModal
          visible={visible}
          toggleModal={this.toggleModal}
          auctionId={info.id}
          creator={info.creator}
          price={info.highestBid || info.listingPrice}
          fetchBids={this.fetchBids}
          fetchInfo={this.fetchInfo}
          type={"auction"}
          {...this.props}
        />
      </div>
    ) : null;
  }
}

export default withRouter(Auction);
