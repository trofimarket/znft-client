import React from "react";
import { withRouter } from "react-router";
import "./AuctionCard.css";

class AuctionCard extends React.Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div
        className="auction-card"
        onClick={() => {
          this.props.history.push(`/auction/${data.id}`);
        }}
      >
        <h1>Auction ID: {data.id}</h1>
        <p>Created At: {new Date(data.createdAt * 1000).toLocaleString()}</p>
        <p>Ends At: {new Date(data.ends * 1000).toLocaleString()}</p>
        <p>Listing Price: {data.listingPrice}</p>
        <p>Token Id: {data.tokenId}</p>
        <p>Creator: {data.creator}</p>
      </div>
    );
  }
}

export default withRouter(AuctionCard);
