import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Skeleton } from "antd";
import { FiExternalLink, FiTwitter, FiLinkedin } from "react-icons/fi";
import { update, vote } from "../../utils/dao-functions";
import "./ProposalCard.css";
import { sharesSupply } from "../../utils/general-functions";
import { ethers } from "ethers";
import { get } from "../../utils/ipfs";
import { votes } from "../../utils/queries/dao.query";

class ProposalCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      localVote: 0,
      totalVotes: 0,
      supply: 0,
      info: null,
      status: null,
      edit: false,
      updating: false,
      newListingFee: null,
      newPlatformFee: null,
    };
  }

  componentDidMount = async () => {
    const supply = await sharesSupply();
    this.setState({ supply });
    this.getInfo();
  };

  getInfo = async () => {
    const info = await get(this.props.proposal.ipfs);
    const result = await votes(this.props.proposal.id);
    this.setState({
      info,
      totalVotes: ethers.utils.formatEther(result.votes),
      status: result.status,
    });
  };

  vote = () => {
    const { signer, address } = this.props;
    this.setState({ loading: true }, async () => {
      const result = await vote(
        this.props.proposal.proposalId,
        signer,
        address
      );
      if (result.success) {
        this.setState({
          loading: false,
          localVote: this.state.localVote + parseInt(result.votes),
        });
      } else {
        this.setState({ loading: false });
      }
    });
  };

  update = async () => {
    this.setState({ updating: true });
    const { proposal } = this.props;
    const { newListingFee, newPlatformFee } = this.state;
    const result = await update(
      this.props.proposal.proposalId,
      newListingFee,
      newPlatformFee,
      proposal.ethWallet,
      proposal.bscWallet,
      proposal.btcWallet,
      this.props.signer
    );
    if (!result) {
      this.setState({ updating: false });
    } else {
      this.props.refresh();
    }
  };

  render() {
    const { proposal, connected, open, address } = this.props;
    const {
      loading,
      localVote,
      supply,
      info,
      totalVotes,
      status,
      edit,
      updating,
      newListingFee,
      newPlatformFee,
    } = this.state;
    return info ? (
      <div className="proposal-card">
        <div className="proposal-id">
          <span>{proposal.proposalId}</span>
        </div>
        <div>
          <h2>{info && info[`Company Name`]}</h2>
          <div className="info">
            <span className="listing-fee">
              Listing Fee :{" "}
              {edit ? (
                <input
                  value={newListingFee}
                  onChange={(e) => {
                    this.setState({ newListingFee: e.target.value });
                  }}
                />
              ) : (
                ethers.utils.formatEther(proposal.listingFee) + " ETH"
              )}
            </span>
            <span className="platform-tax">
              Platform Tax :{" "}
              {edit ? (
                <input
                  value={newPlatformFee}
                  onChange={(e) => {
                    this.setState({ newPlatformFee: e.target.value });
                  }}
                />
              ) : (
                proposal.platformFee + " %"
              )}
            </span>
            <span className="platform-tax">
              Company E-mail : {info && info[`Company Email`]}
            </span>
            <span className="platform-tax">
              Company Description : {info && info[`Company Description`]}
            </span>
            <span className="platform-tax">
              Proposed Products : {info && info[`Proposed Products`]}
            </span>
            <span className="platform-tax">
              ETH Wallet : {proposal.ethWallet}
            </span>
            <span className="platform-tax">
              BTC Wallet : {proposal.btcWallet}
            </span>
            <span className="platform-tax">
              BSC Wallet : {proposal.bscWallet}
            </span>
            <span className="mt-20 mb-20">
              {info && address === info.Address ? (
                edit ? (
                  <>
                    <Button
                      onClick={() => {
                        this.update();
                      }}
                      loading={updating}
                    >
                      Save Changes
                    </Button>
                    <Button
                      className="ml-20"
                      onClick={() => {
                        this.setState({
                          edit: false,
                          newListingFee: ethers.utils.formatEther(
                            proposal.listingFee
                          ),
                          newPlatformFee: proposal.platformFee,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      this.setState({
                        edit: true,
                        newListingFee: ethers.utils.formatEther(
                          proposal.listingFee
                        ),
                        newPlatformFee: proposal.platformFee,
                      });
                    }}
                  >
                    Update Listing
                  </Button>
                )
              ) : null}
            </span>
          </div>
          <div className="company-icons">
            <a
              href={info && info[`Company Website`]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiExternalLink size={25} style={{ color: "#28cd88" }} />
            </a>
            <a
              href={`https://twitter.com/tweet/${info && info[`Twitter URL`]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiTwitter size={25} style={{ color: "#28cd88" }} />
            </a>
            <a
              href={`https://linkedin.com/company/${
                info && info[`LinkedIn URL`]
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiLinkedin size={25} style={{ color: "#28cd88" }} />
            </a>
          </div>
        </div>
        <div className="vote-div">
          <span>
            {totalVotes &&
              ((parseFloat(totalVotes) + localVote) / supply) * 100}{" "}
            %
          </span>
          <p>Vote Percentage</p>
          <div>
            {connected ? (
              status && status ? (
                <h2 style={{ color: "#28cd88" }}>APPROVED</h2>
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
    ) : (
      <Skeleton.Button
        active
        size={180}
        style={{ width: 600, marginBottom: "2rem" }}
      />
    );
  }
}

export default withRouter(ProposalCard);
