import React from "react";
import { getFromLink } from "../../utils/ipfs";
import { Skeleton } from "antd";
import "./NftCard.css";
import { withRouter } from "react-router";
import { uri } from "../../utils/nft-functions";

class NftSimpleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { info: null };
  }

  async componentDidMount() {
    const { data } = this.props;
    const hash = await uri(data.tokenId);
    const info = await getFromLink(hash.uri);
    this.setState({ info });
  }

  render() {
    const { info } = this.state;
    return info === null ? (
      <Skeleton active />
    ) : (
      <div className="nft-card">
        <h1># {parseInt(this.props.data.tokenId)}</h1>
        <h4>Cover Image</h4>
        {info.cover ? (
          <div
            className="supporting-file"
            onClick={() =>
              window.open(`https://ipfs.trofi.one/ipfs/${info.cover}`)
            }
          >
            {String(info.cover).substring(0, 10) +
              "**********" +
              String(info.cover).substring(
                info.cover.length - 10,
                info.cover.length
              )}
          </div>
        ) : null}
        <br />
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
      </div>
    );
  }
}

export default withRouter(NftSimpleCard);
