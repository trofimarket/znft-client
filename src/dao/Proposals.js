import React from "react";
import { withRouter } from "react-router-dom";
import { Tabs } from "antd";
import ListingProposal from "./components/ListingProposal";
import DistributionProposal from "./components/DistributionProposal";

const { TabPane } = Tabs;

class Proposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "1",
    };
  }

  render() {
    const { current } = this.state;
    return (
      <div className="create-merchant-wrapper">
        <div>
          <h1>Proposals. </h1>
          <p>
            Approve (or) Deny companies willing to list. You must own TroFi
            shares to vote.
          </p>
          <Tabs
            defaultActiveKey={current}
            onChange={(e) => this.setState({ current: e })}
          >
            <TabPane tab="Listing Proposals" key="1">
              {current === "1" ? <ListingProposal {...this.props} /> : null}
            </TabPane>
            <TabPane tab="Distribution Proposals" key="2">
              {current === "2" ? (
                <DistributionProposal {...this.props} />
              ) : null}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withRouter(Proposals);
