import React from "react";
import { getFromLink } from "../../utils/ipfs";
import { Button, Skeleton } from "antd";
import "./NftCard.css";
import { withRouter } from "react-router";

class NftCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { info: null };
  }

  async componentDidMount() {
    const { data } = this.props;
    const info = await getFromLink(data.hash);
    this.setState({ info });
  }

  render() {
    const { info } = this.state;
    return info === null ? (
      <Skeleton.Button
        active
        size={180}
        style={{ width: 600, marginBottom: "2rem" }}
      />
    ) : (
      <div className="nft-card">
        <h1>{info.title}</h1>
        <p>Description: {info.description}</p>
        <p>Properties: {info.properties}</p>
        <p>Created By: {info.Address}</p>
        <p>Files: </p>
        {info.files.map((data, index) => {
          return (
            <a
              href={`https://ipfs.io/ipfs/${data}`}
              key={index}
              target="_blank"
              rel="noreferrer"
            >
              {data}
            </a>
          );
        })}
        <br />
        <br />
        <Button
          onClick={() => {
            this.props.propsCall(this.props.data.id);
          }}
        >
          List for sale
        </Button>
      </div>
    );
  }
}

export default withRouter(NftCard);
