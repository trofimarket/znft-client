import React from "react";
import ClaimCard from "../components/ClaimCard/ClaimCard";
import { claims } from "../utils/queries/auction.query";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
    };
  }

  async componentDidMount() {
    if (this.props.connected) {
      const info = await claims(this.props.address);
      console.log(info);
      this.setState({ info });
    }
  }

  render() {
    const { info } = this.state;
    return info === null
      ? null
      : info.map((data, index) => (
          <ClaimCard data={data} key={index} {...this.props} />
        ));
  }
}

export default Profile;
