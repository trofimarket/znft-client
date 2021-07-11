import React from "react";
import { Tabs } from "antd";
import { withRouter } from "react-router";
import Auction from "./auction";
import TopTime from "./toptime";

const { TabPane } = Tabs;

class Profile extends React.Component {
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
        <div className="container-sm pt-20">
          <Tabs
            defaultActiveKey={current}
            onChange={(e) => this.setState({ current: e })}
          >
            <TabPane tab="Traditional Auction" key="1">
              {current === "1" ? <Auction {...this.props} /> : null}
            </TabPane>
            <TabPane tab="TopTime Auction" key="2">
              {current === "2" ? <TopTime {...this.props} /> : null}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
