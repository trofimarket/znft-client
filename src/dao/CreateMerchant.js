import React, { Component } from "react";
import "./styles/CreateMerchant.css";

export default class CreateMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameOfCompany: "",
    };
  }

  handleChange(e) {
    console.log(e);
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { nameOfCompany } = this.state;
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
              <input placeholder="Website" />
            </div>
            <div className="pt-40">
              <span className="form-label">Social Info</span>
              <input placeholder="Twitter Handle" />
              <input placeholder="LinkedIn Page" />
            </div>
            <div className="pt-40">
              <span className="form-label">Platform Info</span>
              <input placeholder="Listing Fee" />
              <p className="form-helper">
                {" "}
                Listing Fee: The fee to be paid whenever you create a new NFT.
              </p>
              <input placeholder="Platform Tax" />
              <p className="form-helper">
                {" "}
                Platform Fee: % of final cost to be paid to the platform.
              </p>
            </div>
          </div>
          <div className="pt-40">
            <button className="primary-button">Create Now</button>
          </div>
        </div>
      </div>
    );
  }
}
