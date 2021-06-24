// import { Button } from "antd";
import React from "react";
import { withRouter } from "react-router";
import BidModal from "../components/Modals/BidModal";
import NftSimpleCard from "../components/NftCard/NftSimpleCard";
import { auctionInfo, bids } from "../utils/queries/auction.query";

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      bids: null,
      visible: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  async componentDidMount() {
    const { auctionId } = this.props.match.params;
    this.fetchInfo(auctionId);
    this.fetchBids(auctionId);
  }

  async fetchInfo(auctionId) {
    const info = await auctionInfo(auctionId);
    console.log(info[0]);
    this.setState({
      info: info[0],
    });
  }

  async fetchBids(auctionId) {
    const bidInfo = await bids(auctionId);
    this.setState({
      bids: bidInfo,
    });
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { info, visible, bids } = this.state;
    return info !== null ? (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h1>Auction Id : {info.id}</h1>
            <p>
              created At: {new Date(info.createdAt * 1000).toLocaleString()}
            </p>
            <p>ends At: {new Date(info.ends * 1000).toLocaleString()}</p>
            <p>Token Id: {info.tokenId}</p>
            <p>Creator: {info.creator}</p>
            <p>Listing Price: {info.listingPrice}</p>
            <p>Creation Hash: {info.creationHash}</p>
          </div>
          {/* <div>
            <Button
              onClick={() => {
                this.toggleModal();
              }}
            >
              Bid Now
            </Button>
          </div> */}
          <div>
            <NftSimpleCard data={info} />
          </div>
        </div>
        <div>
          {bids !== null
            ? bids.map((data, index) => (
                <div key={index}>
                  <p>{data.bidder}</p>
                  <p>{data.currency}</p>
                  <p>{data.amount}</p>
                  <p>{data.id}</p>
                </div>
              ))
            : null}
        </div>
        <BidModal
          visible={visible}
          toggleModal={this.toggleModal}
          auctionId={info.id}
          price={info.highestBid || info.listingPrice}
          {...this.props}
        />
      </div>
    ) : null;
  }
}

export default withRouter(Auction);
