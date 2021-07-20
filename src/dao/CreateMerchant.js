import React, { Component } from "react";
import { Button } from "antd";
import Lottie from "react-lottie";
import { create, upload } from "../utils/dao-functions";
import animationData from "../assets/lottie-files/success-state.json";
import "./styles/CreateMerchant.css";
import { withRouter } from "react-router";
import { uploadBuffer } from "../utils/ipfs";
import { merchantStatus } from "../utils/queries/dao.query";

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
      email: "",
      description: "",
      products: "",
      secret: "",
      registration: "",
      signedDoc: "",
      ethWallet: "",
      btcWallet: "",
      bscWallet: "",
      loading: false,
      success: false,
      uploading: false,
      error: true,
      errorMsg: "",
      isMerchant: false,
    };
    this.captureFile = this.captureFile.bind(this);
  }

  componentDidMount = async () => {
    if (this.props.connected) {
      const array = new Uint32Array(1);
      const status = await merchantStatus(this.props.address);
      if (!status.error) {
        this.setState({ isMerchant: status.status });
      }
      this.setState({
        secret:
          window.crypto.getRandomValues(array) +
          String(this.props.address.substring(10, 20)),
      });
    }
  };

  componentDidUpdate = () => {
    if (!this.state.secret) {
      if (this.props.connected) {
        const array = new Uint32Array(1);
        this.setState({
          secret:
            window.crypto.getRandomValues(array) +
            String(this.props.address.substring(10, 20)),
        });
      }
    }
  };

  captureFile(event, type) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(reader.result) });
      this.upload(type);
    };
  }

  async handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  upload = async (type) => {
    this.setState({ uploading: true });
    const { buffer } = this.state;
    const result = await uploadBuffer(buffer);
    if (result) {
      if (type === "registration") {
        this.setState({ uploading: false, registration: result });
      } else {
        this.setState({
          uploading: false,
          signedDoc: result,
        });
      }
    }
  };

  validate() {
    const {
      nameOfCompany,
      website,
      email,
      description,
      products,
      registration,
      signedDoc,
      listingFee,
      platformTax,
    } = this.state;
    this.setState({ loading: true }, () => {
      if (!nameOfCompany) {
        this.setError("Please Enter Name of Your Company");
      } else if (!website) {
        this.setError("Please Enter Website of Your Company");
      } else if (!email) {
        this.setError("Please Enter Email of Your Company");
      } else if (!description) {
        this.setError("Please Enter Description of Your Company");
      } else if (!products) {
        this.setError("Please Enter Products of Your Company");
      } else if (!registration) {
        this.setError("Please Upload Company Registration Document");
      } else if (!signedDoc) {
        this.setError("Please Upload the Signed Document");
      } else if (!listingFee) {
        this.setError("Please Enter Platform Listing Fee");
      } else if (!platformTax) {
        this.setError("Please Enter Platform Tax Percentage");
      } else {
        this.submit();
      }
    });
  }

  setError(message) {
    this.setState({
      error: true,
      errorMsg: message,
    });
  }

  async submit() {
    this.setState({ loading: true });
    const data = JSON.stringify({
      "Company Name": this.state.nameOfCompany,
      "Company Website": this.state.website,
      "Company Email": this.state.email,
      "Company Description": this.state.description,
      "Proposed Products": this.state.products,
      Secret: this.state.secret,
      "Business Registration": this.state.registration,
      "Signed Letter": this.state.signedDoc,
      "Twitter URL": this.state.twitter,
      "LinkedIn URL": this.state.linkedIn,
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
    const { ethWallet, bscWallet, btcWallet } = this.state;
    const tx = await create(
      hash,
      listingFee,
      platformTax,
      ethWallet,
      bscWallet,
      btcWallet,
      this.props.signer
    );
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
      email,
      description,
      products,
      secret,
      uploading,
      error,
      errorMsg,
      ethWallet,
      btcWallet,
      bscWallet,
      isMerchant,
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
              Now your company will be available for the TroFi shareholders for
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
            <p>Merchants must be approved by the TroFi Shareholders.</p>
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
                <input
                  name="email"
                  placeholder="Official E-mail of Company"
                  onChange={(e) => this.handleChange(e)}
                  value={email}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Company Info</span>
                <input
                  name="description"
                  placeholder="Company Description"
                  onChange={(e) => this.handleChange(e)}
                  value={description}
                />
                <input
                  name="products"
                  placeholder="Proposed Products to List"
                  onChange={(e) => this.handleChange(e)}
                  value={products}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">
                  Business Registration Document
                </span>
                <input
                  name="registration"
                  placeholder="Company Registration Documentation"
                  type="file"
                  onChange={(e) => this.captureFile(e, "registration")}
                  accept=".png,.jpeg,.jpg,.pdf"
                  id="fileupload"
                  disabled={uploading}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Signed Company Letter</span>
                <input
                  name="signedDoc"
                  placeholder="Signed Letter from Company"
                  type="file"
                  onChange={(e) => this.captureFile(e, "signedDoc")}
                  accept=".png,.jpeg,.jpg,.pdf"
                  id="fileupload"
                  disabled={uploading}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Settlement Wallet Info</span>
                <input
                  name="ethWallet"
                  placeholder="Ethereum Settlement Wallet"
                  onChange={(e) => this.handleChange(e)}
                  value={ethWallet}
                />
                <input
                  name="bscWallet"
                  placeholder="BSC Settlement Wallet"
                  onChange={(e) => this.handleChange(e)}
                  value={bscWallet}
                />
                <input
                  name="btcWallet"
                  placeholder="Bitcoin Settlement Wallet"
                  onChange={(e) => this.handleChange(e)}
                  value={btcWallet}
                />
              </div>
              <div className="pt-40">
                <span className="form-label">Social Info</span>
                <p className="form-helper">
                  To connect validate social media accounts, please post the
                  following <br />
                  <b>
                    We are registering on the TroFi Market! Our unique code is{" "}
                    {secret}.
                  </b>
                  <br />
                </p>
                <input
                  name="twitter"
                  placeholder="Tweet URL"
                  onChange={(e) => this.handleChange(e)}
                  value={twitter}
                />
                <input
                  name="linkedIn"
                  placeholder="LinkedIn Post URL"
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
            {error ? <p>{errorMsg}</p> : null}
            <div className="pt-40">
              {this.props.connected ? (
                <Button
                  loading={loading || uploading}
                  disabled={isMerchant}
                  onClick={() => {
                    this.validate();
                  }}
                  className="primary-button"
                >
                  {uploading
                    ? "Uploading To IPFS"
                    : isMerchant
                    ? "Merhant Already Registered"
                    : "Create Now"}
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
