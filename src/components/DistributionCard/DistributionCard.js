import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";

class DistributionCard extends React.Component {
  render() {
    const { distribution } = this.props;
    console.log(distribution);
    return (
      <div className="proposal-card">
        <div className="proposal-id">
          <span>{parseInt(distribution.id)}</span>
        </div>
        <div>
          <h1>
            # {distribution.earners.length}{" "}
            <span style={{ fontSize: "1rem" }}>Beneficiaries</span>
          </h1>
          {distribution.Rejected ? (
            <h1 className="special-text" style={{ color: "red" }}>
              REJECTED
            </h1>
          ) : distribution.Settled ? (
            <h1 className="special-text" style={{ color: "#28cd88" }}>
              ACCEPTED
            </h1>
          ) : (
            <h1>ONGOING</h1>
          )}
        </div>
        <div>
          <Button
            onClick={() => {
              this.props.history.push(`/distribution/${distribution.id}`);
            }}
            type="primary"
            className="vote-button"
          >
            More Info
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(DistributionCard);
