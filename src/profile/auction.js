import React from "react";
import AuctionClaimCard from "../components/ClaimCard/AuctionClaimCard";
import AuctionSettlementCard from "../components/SettlementCard/AuctionSettlement";
import NotConnected from "../components/States/NotConnected";
import { aClaims, aSettles } from "../utils/queries/auction.query";

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      settles: null,
      loading: true,
    };
  }

  async componentDidMount() {
    if (this.props.connected) {
      const info = await aClaims(this.props.address);
      const settles = await aSettles(this.props.address);
      this.setState({ info, settles, loading: false });
    }
  }

  async componentDidUpdate() {
    if (this.props.connected && this.state.loading) {
      const info = await aClaims(this.props.address);
      const settles = await aSettles(this.props.address);
      this.setState({ info, settles, loading: false });
    }
  }

  render() {
    const { info, settles } = this.state;
    const { connected } = this.props;
    return (
      <div>
        {connected ? (
          <div>
            {info === null ? null : <h1>YOUR AUCTION BIDS</h1>}
            {info === null ? null : (
              <div className="balances-grid">
                {info.map((data, index) => (
                  <AuctionClaimCard data={data} key={index} {...this.props} />
                ))}
              </div>
            )}
            {settles === null ? null : <h1>AUCTION CREATED</h1>}
            {settles === null ? null : (
              <div className="balances-grid">
                {settles.map((data, index) => (
                  <AuctionSettlementCard
                    data={data}
                    key={index}
                    {...this.props}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <NotConnected {...this.props} />
        )}
      </div>
    );
  }
}

export default Auction;
