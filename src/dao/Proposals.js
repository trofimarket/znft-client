import React from "react";
import { withRouter } from "react-router-dom";
import { list, proposals } from "../utils/dao-functions";
import ProposalCard from "../components/ProposalCard/ProposalCard";
import { Skeleton, Pagination } from "antd";

class Proposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposals: [],
      loading: true,
      total: 0,
      start: 1,
      end: 5,
      current: 1,
    };
  }

  componentDidMount = () => {
    this.fetch();
  };

  handlePageChange = (pageNumber) => {
    this.setState(
      {
        start: (pageNumber - 1) * 5 + 1,
        end: pageNumber * 5,
        current: pageNumber,
        loading: true,
      },
      () => {
        this.fetch();
      }
    );
  };

  fetch = async () => {
    const { start, end } = this.state;
    const count = await proposals();
    const proposal = await list(start, end);
    this.setState({ proposals: proposal, loading: false, total: count });
  };

  render() {
    const { proposals, loading, total, current } = this.state;
    return (
      <div className="proposal">
        <div>
          <h1>Proposals. </h1>
          <p>Approve (or) Deny companies willing to list.</p>
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
              {proposals.map((data, index) => (
                <ProposalCard {...this.props} proposal={data} key={index} />
              ))}
              <Pagination
                current={current}
                pageSize={5}
                total={total}
                onChange={(e) => {
                  this.handlePageChange(e);
                }}
              />
            </div>
          )}
        </div>
        <div className="pagination">
          <h3>Search. </h3>
          <p>
            Every proposal is asigned with an ID. You can search for the company
            using your proposal ID.
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(Proposals);
