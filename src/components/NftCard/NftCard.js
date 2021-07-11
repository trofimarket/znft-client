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
        size={500}
        style={{ width: 350, marginBottom: "2rem" }}
      />
    ) : (
      <div className="nft-card">
        {info.cover ? (
          <img
            src={`https://ipfs.trofi.one/ipfs/${info.cover}`}
            alt={info.cover}
          />
        ) : null}
        <h1># {parseInt(this.props.data.id)}</h1>
        <h3>{info.title}</h3>
        <p>{info.description}</p>
        <br />
        <h4>Properties</h4>
        <p>{info.properties}</p>
        <br />
        <h4>Files</h4>
        {info.files.map((data, index) => {
          return (
            <div
              className="supporting-file"
              key={index}
              onClick={() => window.open(`https://ipfs.trofi.one/ipfs/${data}`)}
            >
              {String(data).substring(0, 10) +
                "**********" +
                String(data).substring(data.length - 10, data.length)}
            </div>
          );
        })}
        <br />
        <br />
        <Button
          className="primary-button"
          loading={this.props.validating === this.props.data.id}
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
