import React from "react";
import { withRouter } from "react-router";
import AuctionCard from "../components/AuctionCard/AuctionCard";
import TopTimeCard from "../components/ToptimeCard/TopTimeCard";
import { auctions } from "../utils/queries/auction.query";
import { toptimes } from "../utils/queries/toptime.query";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auction: null,
      toptime: null,
    };
  }

  async componentDidMount() {
    this.fetchAuctions();
    this.fetchTopTimes();
  }

  async fetchAuctions() {
    const auction = await auctions();
    this.setState({
      auction,
    });
  }

  async fetchTopTimes() {
    const toptime = await toptimes();
    this.setState({
      toptime,
    });
  }

  render() {
    const { auction, toptime } = this.state;
    return (
      <div>
        {auction === null ? null : (
          <div>
            <h1>TIME-BASED AUCTIONS 🔥</h1>
            <div className="marketplace-grid mt-40">
              {auction.map((data, index) => (
                <AuctionCard data={data} key={index} />
              ))}
            </div>
          </div>
        )}
        {toptime === null ? null : (
          <div>
            <h1>TOP-TIME AUCTIONS 🔥</h1>
            <div className="marketplace-grid mt-40">
              {toptime.map((data, index) => (
                <TopTimeCard data={data} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(List);
