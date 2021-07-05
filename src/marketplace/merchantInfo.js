import React from "react";
import { Spin } from "antd";
import { withRouter } from "react-router";
import { merchant } from "../utils/queries/auction.query";

class MerchantInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      loading: true,
    };
  }

  componentDidMount = async () => {
    const { address } = this.props.match.params;
    const data = await merchant(address);
    this.setState({
      loading: false,
      info: data,
    });
  };

  render() {
    const { loading, info } = this.state;
    const { address } = this.props.match.params;
    return loading ? (
      <Spin />
    ) : (
      <div className="create-merchant-wrapper">
        <div className="pt-20">
          <h1>Information About Merchant</h1>
          <p>
            Merhant information is stored to ipfs <br />
            Viewing for {address}
          </p>
        </div>
        <div className="pt-20">
          <span className="form-label">Company Info</span> <br />
          <input value={info[`Company Name`]} readOnly />
          <input value={info[`Company Email`]} readOnly />
          <input value={info[`Company Website`]} readOnly />
        </div>
        <div className="pt-20">
          <span className="form-label">Detailed Info</span> <br />
          <input value={info[`Company Description`]} readOnly />
          <input value={info[`Proposed Products`]} readOnly />
        </div>
        <div className="pt-20">
          <span className="form-label">Documents Hash</span> <br />
          <input value={info[`Business Registration`]} readOnly />
          <input value={info[`Signed Letter`]} readOnly />
        </div>
        <div className="pt-20">
          <span className="form-label">Socials Info</span> <br />
          <input value={info[`LinkedIn URL`]} readOnly />
          <input value={info[`Twitter URL`]} readOnly />
        </div>
        <div className="pt-20">
          <span className="form-label">Listing Fee</span> <br />
          <input value={info[`Listing Fee`]} readOnly />
        </div>
        <div className="pt-20">
          <span className="form-label">Platform Tax</span> <br />
          <input value={info[`Platform Tax`] + "%"} readOnly />
        </div>
      </div>
    );
  }
}

export default withRouter(MerchantInfo);
