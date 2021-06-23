import React from "react";
import { Tabs } from "antd";
import { withRouter } from "react-router";
import CreateItem from "./create";
import ListItem from "./list";

const { TabPane } = Tabs;

class Index extends React.Component {
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
          <Tabs defaultActiveKey={current}>
            <TabPane tab="Mint New NFT" key="1">
              <CreateItem {...this.props} />
            </TabPane>
            <TabPane tab="List NFT for Sale" key="2">
              <ListItem {...this.props} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withRouter(Index);
