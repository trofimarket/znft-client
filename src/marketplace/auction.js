// import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import BidModal from "../components/Modals/BidModal";
import NftSimpleCard from "../components/NftCard/NftSimpleCard";
import { auctionInfo, bids } from "../utils/queries/auction.query";
import { FiExternalLink, FiUser, FiDollarSign } from "react-icons/fi";
import Countdown from "react-countdown";
import { notify } from "../utils/general-functions";

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <h1 style={{ color: "#28cd88" }}>SALE ENDED</h1>;
  } else {
    // Render a countdown
    return (
      <span>
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
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  async componentDidMount() {
    const { auctionId } = this.props.match.params;
    this.fetchInfo(auctionId);
    this.fetchBids(auctionId);
  }

  async fetchInfo(auctionId) {
    const info = await auctionInfo(auctionId);
    console.log(info[0]);
    this.setState({
      info: info[0],
    });
  }

  async fetchBids(auctionId) {
    const bidInfo = await bids(auctionId);
    this.setState({
      bids: bidInfo,
    });
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { info, visible, bids } = this.state;
    console.log(bids);
    return info !== null ? (
      <div>
        <div className="auction-grid">
          <div className="auction-info">
            <h1>Auction Id : {info.id}</h1>
            <Countdown date={new Date(info.ends * 1000)} renderer={renderer} />
            <p>
              Listing Price <br />
              <span className="special-text">
                USD {info.listingPrice / 10 ** 8}
              </span>
            </p>
            <p>
              Highest Bid <br />
              <span className="special-text">
                USD {info.highestBid / 10 ** 8}
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
                    window.open(
                      `https://kovan.etherscan.io/address/${info.creator}`
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
                <td>Amount</td>
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
                      <td>$ {data.amount / 10 ** 8}</td>
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
          price={info.highestBid || info.listingPrice}
          {...this.props}
        />
      </div>
    ) : null;
  }
}

export default withRouter(Auction);
