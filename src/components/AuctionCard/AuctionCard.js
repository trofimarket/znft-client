import React from "react";
import { withRouter } from "react-router";
import "./AuctionCard.css";
import Countdown from "react-countdown";
import { FiExternalLink, FiUser } from "react-icons/fi";
import { Button } from "antd";
import { uri } from "../../utils/nft-functions";
import { getFromLink } from "../../utils/ipfs";

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <h1 style={{ color: "#28cd88" }}>SALE ENDED</h1>;
  } else {
    // Render a countdown
    return (
      <span style={{ color: "#28cd88", fontSize: "1rem" }}>
        {hours} Hours {minutes} Mins {seconds} Seconds
      </span>
    );
  }
};

class AuctionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { info: null };
  }

  async componentDidMount() {
    const { data } = this.props;
    const hash = await uri(data.tokenId);
    const info = await getFromLink(hash.uri);
    this.setState({ info });
  }

  render() {
    const { data } = this.props;
    const { info } = this.state;
    return (
      <div className="auction-card">
        {info && info.cover ? (
          <img src={`https://ipfs.io/ipfs/${info.cover}`} alt={info.cover} />
        ) : (
          <h1># TOKEN ID {data.tokenId}</h1>
        )}
        <div>
          <p>
            Current Price <br />
            <span className="special-text">
              USD {data.highestBid / 10 ** 8 || data.listingPrice / 10 ** 8}
            </span>
          </p>
        </div>
        <Countdown
          className="mt-40"
          date={new Date(data.ends * 1000)}
          renderer={renderer}
        />
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
                window.open(
                  `https://kovan.etherscan.io/address/${data.creator}`
                );
              }}
              size={30}
            />
          </div>
        </div>
        <Button
          className="primary-button mt-40"
          onClick={() => {
            this.props.history.push(`/auction/${data.id}`);
          }}
        >
          More Info
        </Button>
        {/* <p>Created At: {new Date(data.createdAt * 1000).toLocaleString()}</p>
        <p>Ends At: {new Date(data.ends * 1000).toLocaleString()}</p>
        <p>Listing Price: {data.listingPrice}</p>
        <p>Creator: {data.creator}</p>
        <p>Settled: {data.isSettled.toString()}</p> */}
      </div>
    );
  }
}

export default withRouter(AuctionCard);
