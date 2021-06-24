import React from "react";
import ClaimCard from "../components/ClaimCard/ClaimCard";
import NotConnected from "../components/States/NotConnected";
import { claims } from "../utils/queries/auction.query";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      loading: true,
    };
  }

  async componentDidMount() {
    if (this.props.connected) {
      const info = await claims(this.props.address);
      this.setState({ info, loading: false });
    }
  }

  async componentDidUpdate() {
    if (this.props.connected && this.state.loading) {
      const info = await claims(this.props.address);
      this.setState({ info, loading: false });
    }
  }

  render() {
    const { info } = this.state;
    const { connected } = this.props;
    return (
      <div className="create-merchant-wrapper">
        <h1>YOUR BIDS</h1>
        {connected ? (
          info === null ? null : (
            <div className="balances-grid">
              {info.map((data, index) => (
                <ClaimCard data={data} key={index} {...this.props} />
              ))}
            </div>
          )
        ) : (
          <NotConnected {...this.props} />
        )}
      </div>
    );
  }
}

export default Profile;
