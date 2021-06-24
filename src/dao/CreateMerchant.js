import React, { Component } from "react";
import { Button } from "antd";
import Lottie from "react-lottie";
import { upload, create } from "../utils/dao-functions";
import animationData from "../assets/lottie-files/success-state.json";
import "./styles/CreateMerchant.css";
import { withRouter } from "react-router";

class CreateMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameOfCompany: "",
      website: "",
      twitter: "",
      linkedIn: "",
      listingFee: "",
      platformTax: "",
      hash: "",
      loading: false,
      success: false,
    };
  }

  async handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  async submit() {
    this.setState({ loading: true });
    const data = JSON.stringify({
      "Company Name": this.state.nameOfCompany,
      "Company Website": this.state.website,
      "Twitter Handle": this.state.twitter,
      "LinkedIn Handle": this.state.linkedIn,
      "Listing Fee": this.state.listingFee,
      "Platform Tax": this.state.platformTax,
      Address: this.props.address,
    });
    const result = await upload(data);
    if (result) {
      this.createMerchant(
        result,
        this.state.listingFee,
        this.state.platformTax
      );
    }
  }

  async createMerchant(hash, listingFee, platformTax) {
    const tx = await create(hash, listingFee, platformTax, this.props.signer);
    if (tx) {
      this.setState({ loading: false, success: true });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      nameOfCompany,
      website,
      twitter,
      linkedIn,
      listingFee,
      platformTax,
      loading,
      success,
    } = this.state;
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
            <h1>Merchant Creation Successful</h1>
            <p>
              Now your company will be available for the ZNFT share holders for
              the voting process. The decision is taken by the community and is
              not influenced by external resources.
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
            <h1>Join Us. List Your Company</h1>
            <p>
              Every seller in ZNFT should be approved by the ZNFT Share Holders.
              The approval mechanism is completely decentralized and supported
              by the DAO of ZNFT markteplace.
            </p>
            <div className="pt-20">
              <div>
                <span className="form-label">General Info</span>
                <input
                  name="nameOfCompany"
                  placeholder="Name of Company"
                  onChange={(e) => this.handleChange(e)}
                  value={nameOfCompany}
                />
                <input
                  name="website"
                  placeholder="Website"
                  onChange={(e) => this.handleChange(e)}
                  value={website}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Social Info</span>
                <input
                  name="twitter"
                  placeholder="Twitter Handle"
                  onChange={(e) => this.handleChange(e)}
                  value={twitter}
                />
                <input
                  name="linkedIn"
                  placeholder="LinkedIn Page"
                  onChange={(e) => this.handleChange(e)}
                  value={linkedIn}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Platform Info</span>
                <input
                  name="listingFee"
                  placeholder="Listing Fee in ETH"
                  onChange={(e) => this.handleChange(e)}
                  value={listingFee}
                />
                <p className="form-helper">
                  {" "}
                  The fee to be paid whenever you create a new NFT. <br />
                </p>
                <input
                  name="platformTax"
                  placeholder="Platform Tax in Percentage"
                  onChange={(e) => this.handleChange(e)}
                  value={platformTax}
                />
                <p className="form-helper">
                  {" "}
                  Platform Fee: % of final cost to be paid to the platform in
                  ETH.
                </p>
              </div>
            </div>
            <div className="pt-40">
              {this.props.connected ? (
                <Button
                  loading={loading}
                  onClick={() => {
                    this.submit();
                  }}
                  className="primary-button"
                >
                  Create Now
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

export default withRouter(CreateMerchant);
