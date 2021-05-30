import React, { Component } from "react";
import { Button } from "antd";
import "./styles/CreateMerchant.css";
import { upload, create } from "../utils/dao-functions";

export default class CreateMerchant extends Component {
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
    };
  }

  handleChange(e) {
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
      this.createMerchant(result);
    }
  }

  async createMerchant(hash) {
    const tx = await create(hash, this.props.signer);
    if (tx) {
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
    } = this.state;
    const { open } = this.props;
    return (
      <div className="create-merchant-wrapper">
        <div className="container-sm pt-20">
          <h1>Create Merchant</h1>
          <p>
            Every merchant in ZNFT should be approved by the ZNFT Share Holders.
            The approval mechanism is completely decentralized and stored on the
            blockchain.
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
                placeholder="Listing Fee"
                onChange={(e) => this.handleChange(e)}
                value={listingFee}
              />
              <p className="form-helper">
                {" "}
                Listing Fee: The fee to be paid whenever you create a new NFT.
              </p>
              <input
                name="platformTax"
                placeholder="Platform Tax"
                onChange={(e) => this.handleChange(e)}
                value={platformTax}
              />
              <p className="form-helper">
                {" "}
                Platform Fee: % of final cost to be paid to the platform.
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
      </div>
    );
  }
}
