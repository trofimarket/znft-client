import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import { FiExternalLink, FiTwitter, FiLinkedin } from "react-icons/fi";
import { vote } from "../../utils/dao-functions";
import "./ProposalCard.css";

class ProposalCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      localVote: 0,
    };
  }

  vote = () => {
    const { signer, address } = this.props;
    this.setState({ loading: true }, async () => {
      const result = await vote(this.props.proposal.id, signer, address);
      if (result) {
        this.setState({ loading: false, localVote: this.state.localVote + 1 });
      }
    });
  };

  render() {
    const { proposal, connected, open } = this.props;
    const { loading, localVote } = this.state;
    return (
      <div className="proposal-card">
        <div className="proposal-id">
          <span>{proposal.id}</span>
        </div>
        <div>
          <h2>{proposal[`Company Name`]}</h2>
          <div className="info">
            <span className="listing-fee">
              Listing Fee : {proposal[`Listing Fee`]}
            </span>
            <span className="platform-tax">
              Platform Tax : {proposal[`Platform Tax`]}
            </span>
          </div>
          <div className="company-icons">
            <a
              href={proposal[`Company Website`]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiExternalLink />
            </a>
            <a
              href={`https://twitter.com/${proposal[`Twitter Handle`]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiTwitter />
            </a>
            <a
              href={`https://linkedin.com/company/${
                proposal[`LinkedIn Handle`]
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiLinkedin />
            </a>
          </div>
        </div>
        <div className="vote-div">
          <span>{parseFloat(proposal.totalVotes) + localVote}</span>
          <p>Votes</p>
          <div>
            {connected ? (
              proposal.status ? (
                "Approved"
              ) : (
                <Button
                  onClick={() => {
                    this.vote();
                  }}
                  loading={loading}
                  type="primary"
                  className="vote-button"
                >
                  Vote Now
                </Button>
              )
            ) : (
              <Button
                onClick={() => {
                  open();
                }}
                type="primary"
                className="vote-button"
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProposalCard);
