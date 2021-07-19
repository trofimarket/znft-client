import React from "react";
import { withRouter } from "react-router-dom";
import { Skeleton } from "antd";
import { distributions } from "../../utils/queries/dao.query";
import DistributionCard from "../../components/DistributionCard/DistributionCard";

class DistributionProposal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distributions: [],
      loading: true,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount = () => {
    this.fetch();
  };

  fetch = async () => {
    const result = await distributions();
    this.setState({ loading: false, distributions: result });
  };

  refresh = () => {
    this.setState({ loading: true });
    this.fetch();
  };

  render() {
    const { distributions, loading } = this.state;
    return (
      <div>
        {loading ? (
          <div className="proposals-list">
            <Skeleton.Button
              active
              size={180}
              style={{ width: 600, marginBottom: "2rem" }}
            />
            <Skeleton.Button
              active
              size={180}
              style={{ width: 600, marginBottom: "2rem" }}
            />
            <Skeleton.Button
              active
              size={180}
              style={{ width: 600, marginBottom: "2rem" }}
            />
          </div>
        ) : (
          <div className="proposals-list">
            {distributions.map((data, index) => (
              <DistributionCard
                {...this.props}
                distribution={data}
                key={index}
                refresh={this.refresh}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(DistributionProposal);
