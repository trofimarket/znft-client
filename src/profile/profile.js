import React from "react";
import AuctionClaimCard from "../components/ClaimCard/AuctionClaimCard";
import TopTimeClaimCard from "../components/ClaimCard/TopTimeClaimCard";
import NotConnected from "../components/States/NotConnected";
import { aClaims } from "../utils/queries/auction.query";
import { tClaims } from "../utils/queries/toptime.query";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      loading: true,
      toptimeclaims: null,
    };
  }

  async componentDidMount() {
    if (this.props.connected) {
      const info = await aClaims(this.props.address);
      const toptimeclaims = await tClaims(this.props.address);
      this.setState({ info, loading: false, toptimeclaims });
    }
  }

  async componentDidUpdate() {
    if (this.props.connected && this.state.loading) {
      const info = await aClaims(this.props.address);
      const toptimeclaims = await tClaims(this.props.address);
      this.setState({ info, loading: false, toptimeclaims });
    }
  }

  render() {
    const { info, toptimeclaims } = this.state;
    const { connected } = this.props;
    return (
      <div className="create-merchant-wrapper">
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
            {toptimeclaims === null ? null : <h1>YOUR TOPTIME BIDS</h1>}
            {toptimeclaims === null ? null : (
              <div className="balances-grid">
                {toptimeclaims.map((data, index) => (
                  <TopTimeClaimCard data={data} key={index} {...this.props} />
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

export default Profile;
