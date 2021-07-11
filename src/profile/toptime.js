import React from "react";
import TopTimeClaimCard from "../components/ClaimCard/TopTimeClaimCard";
import TopTimeSettlementCard from "../components/SettlementCard/ToptimeSettlement";
import NotConnected from "../components/States/NotConnected";
import { tClaims, tSettles } from "../utils/queries/toptime.query";

class TopTime extends React.Component {
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
      const info = await tClaims(this.props.address);
      const settles = await tSettles(this.props.address);
      this.setState({ info, settles, loading: false });
    }
  }

  async componentDidUpdate() {
    if (this.props.connected && this.state.loading) {
      const info = await tClaims(this.props.address);
      const settles = await tSettles(this.props.address);
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
            {info === null ? null : <h1>YOUR TOPTIME BIDS</h1>}
            {info === null ? null : (
              <div className="balances-grid">
                {info.map((data, index) => (
                  <TopTimeClaimCard data={data} key={index} {...this.props} />
                ))}
              </div>
            )}
            {settles === null ? null : <h1>TOPTIME CREATED</h1>}
            {settles === null ? null : (
              <div className="balances-grid">
                {settles.map((data, index) => (
                  <TopTimeSettlementCard
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

export default TopTime;
