import React, { Component } from "react";
import { Button } from "antd";
import Lottie from "react-lottie";
import { cDistribution } from "../utils/dao-functions";
import animationData from "../assets/lottie-files/success-state.json";
import "./styles/CreateMerchant.css";
import { withRouter } from "react-router";

class CreateDistribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentages: null,
      addresses: null,
      loading: false,
      success: false,
      error: false,
      errorMsg: "",
    };
  }

  async handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  validate() {
    const { addresses, percentages } = this.state;
    this.setState({ loading: true }, () => {
      if (!addresses) {
        this.setError("Please input addresses");
      } else if (!percentages) {
        this.setError("Please input percentages");
      } else {
        this.submit();
      }
    });
  }

  setError(message) {
    this.setState({
      error: true,
      errorMsg: message,
      loading: false,
    });
  }

  async submit() {
    this.setState({ loading: true });
    const { addresses, percentages } = this.state;
    const { signer } = this.props;
    let result = await cDistribution(
      JSON.parse(addresses),
      JSON.parse(percentages),
      signer
    );
    console.log(result);
    if (!result) {
      this.setState({ loading: false });
    } else {
      this.setState({
        loading: false,
        addresses: null,
        percentages: null,
        success: true,
      });
    }
  }

  render() {
    const { percentages, addresses, error, errorMsg, loading, success } =
      this.state;
    const { open } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div className="create-merchant-wrapper">
        {success ? (
          <div>
            <h1>Payout Proposal Creation Successful</h1>
            <p>
              Now your proposal will be voted by our znft share holder. Approved
              proposals will get the revenue distributed.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Lottie options={defaultOptions} height={400} width={400} />
              <Button
                onClick={() => {
                  this.props.history.push("/proposals");
                }}
                className="primary-button mt-40"
              >
                Go To Proposals
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-20">
            <h1>Propose Payouts</h1>
            <p>Any ZNFT Share holders can propose a payout for the holders.</p>
            <div className="pt-20">
              <div>
                <span className="form-label">Addresses</span>
                <input
                  name="addresses"
                  placeholder="All Addresses as Array"
                  onChange={(e) => this.handleChange(e)}
                  value={addresses}
                />
              </div>
              <div className="pt-20">
                <span className="form-label">Percentages</span>
                <input
                  name="percentages"
                  placeholder="Payout Percentages as Array"
                  onChange={(e) => this.handleChange(e)}
                  value={percentages}
                />
              </div>
            </div>
            {error ? <p>{errorMsg}</p> : null}
            <div className="pt-40">
              {this.props.connected ? (
                <Button
                  loading={loading}
                  onClick={() => {
                    this.validate();
                  }}
                  className="primary-button"
                >
                  {loading ? "Creating Payout Proposal" : "Propose Now"}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    open();
                  }}
                  className="primary-button"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(CreateDistribution);
