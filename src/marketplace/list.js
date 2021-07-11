import React from "react";
import { withRouter } from "react-router";
import AuctionCard from "../components/AuctionCard/AuctionCard";
import FixedPriceCard from "../components/FixedPriceCard/FixedPriceCard";
import TopTimeCard from "../components/ToptimeCard/TopTimeCard";
import { auctions } from "../utils/queries/auction.query";
import { fixedPrices } from "../utils/queries/fixedprice.query";
import { toptimes } from "../utils/queries/toptime.query";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auction: null,
      toptime: null,
      fixedPrice: null,
    };
  }

  async componentDidMount() {
    this.fetchAuctions();
    this.fetchTopTimes();
    this.fetchFixedPrices();
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

  async fetchFixedPrices() {
    const fixedPrice = await fixedPrices();
    console.log(fixedPrice);
    this.setState({
      fixedPrice,
    });
  }

  render() {
    const { auction, toptime, fixedPrice } = this.state;
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
        )}{" "}
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
        {fixedPrice === null ? null : (
          <div>
            <h1>FIXED PRICE SALES 🔥</h1>
            <div className="marketplace-grid mt-40">
              {fixedPrice.map((data, index) => (
                <FixedPriceCard data={data} key={index} {...this.props} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(List);
