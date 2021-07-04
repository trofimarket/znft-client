// import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import BidModal from "../components/Modals/BidModal";
import NftSimpleCard from "../components/NftCard/NftSimpleCard";
import { toptimeInfo, bids } from "../utils/queries/toptime.query";
import { FiExternalLink, FiUser, FiDollarSign } from "react-icons/fi";
import { notify } from "../utils/general-functions";
import BTC from "../assets/coin-icons/btc.png";

class TopTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      bids: null,
      visible: false,
      fetchingBids: true,
      time: 0,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.fetchBids = this.fetchBids.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
  }

  async componentDidMount() {
    const { toptimeId } = this.props.match.params;
    this.fetchInfo(toptimeId);
    this.fetchBids(toptimeId);
  }

  async fetchInfo(toptimeId) {
    const info = await toptimeInfo(toptimeId);
    if (info[0].highestBidAt) {
      const time =
        parseFloat(info[0].toptime) -
        (Date.now() / 1000 - parseFloat(info[0].highestBidAt));
      this.setState({
        time: time,
      });
    }
    this.setState({
      info: info[0],
    });
  }

  async fetchBids(toptimeId) {
    const bidInfo = await bids(toptimeId);
    this.setState({
      bids: bidInfo,
      fetchingBids: false,
    });
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { info, visible, bids, time } = this.state;
    return info !== null ? (
      <div>
        <div className="auction-grid">
          <div className="auction-info">
            <h1>TopTime Id : {info.id}</h1>
            <p>
              Listing Price <br />
              <span className="special-text">
                <img
                  src={BTC}
                  style={{ width: "25px", marginRight: "0.3rem" }}
                />
                {info.highestBid / 10 ** 8 || info.listingPrice / 10 ** 8}
              </span>
            </p>
            <p>
              Top Time <br />
              <span className="special-text" style={{ color: "#28cd88" }}>
                {info.toptime} Secs
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
                    time >= 0
                      ? this.props.connected
                        ? this.toggleModal()
                        : this.props.open()
                      : notify(
                          "warning",
                          "Top time already reached",
                          "Only you can place bid before the toptime",
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
          price={info.highestBid || info.listingPrice}
          fetchBids={this.fetchBids}
          fetchInfo={this.fetchInfo}
          {...this.props}
        />
      </div>
    ) : null;
  }
}

export default withRouter(TopTime);
