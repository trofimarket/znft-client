import React from "react";
import { withRouter } from "react-router";
import AuctionCard from "../components/AuctionCard/AuctionCard";
import { auctions } from "../utils/queries/auction.query";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  async componentDidMount() {
    const data = await auctions();
    this.setState({
      data,
    });
  }

  render() {
    const { data } = this.state;
    return data === null ? null : (
      <div>
        <h1>LIVE AUCTIONS 🔥</h1>
        <div className="marketplace-grid mt-40">
          {data.map((data, index) => (
            <AuctionCard data={data} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(List);
