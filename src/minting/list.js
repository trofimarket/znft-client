import React from "react";
import { Button, Spin, Radio } from "antd";
import NftCard from "../components/NftCard/NftCard";
import {
  checkApprovalAuction,
  checkApprovalTopTime,
} from "../utils/nft-functions";
import { balances } from "../utils/queries/nft.query";
import { createAuction } from "../utils/auction-functions";
import { createTopTime } from "../utils/toptime-functions";
import NotConnected from "../components/States/NotConnected";
import Approve from "./approve";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      status: false,
      status1: false,
      loading: true,
      buttonLoading: false,
      list: false,
      tokenId: "",
      price: "0",
      ends: "",
      toptime: "",
      type: "auction",
    };
    this.propsCall = this.propsCall.bind(this);
    this.approve = this.approve.bind(this);
  }

  async componentDidMount() {
    if (this.props.connected) {
      const approval = await checkApprovalAuction(this.props.address);
      const approval2 = await checkApprovalTopTime(this.props.address);
      if (!approval.error && !approval2.error) {
        this.setState({
          status: approval.status,
          status1: approval2.status,
          loading: false,
        });
        this.fetchBalance();
      }
    }
  }

  async componentDidUpdate() {
    if (this.props.address && this.state.loading) {
      const approval = await checkApprovalAuction(this.props.address);
      const approval2 = await checkApprovalTopTime(this.props.address);
      if (!approval.error && !approval2.error) {
        this.setState({
          status: approval.status,
          status1: approval2.status,
          loading: false,
        });
        this.fetchBalance();
      }
    }
  }

  async fetchBalance() {
    const balance = await balances(this.props.address);
    this.setState({ balance });
  }

  approve(type) {
    if (type === "auction") {
      this.setState({ status: true });
    } else {
      this.setState({ status1: true });
    }
  }

  propsCall(id) {
    this.setState({
      list: true,
      tokenId: id,
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  listToken() {
    this.setState({ buttonLoading: true }, async () => {
      const { price, ends, tokenId, toptime, type } = this.state;
      if (type === "auction") {
        console.log("auction");
        const tx = await createAuction(tokenId, price, ends, this.props.signer);
        if (tx) {
          this.setState({ buttonLoading: false });
        }
      } else {
        const tx = await createTopTime(
          tokenId,
          price,
          toptime,
          this.props.signer
        );
        if (tx) {
          this.setState({ buttonLoading: false });
        }
      }
    });
  }

  render() {
    const {
      balance,
      loading,
      status,
      status1,
      buttonLoading,
      list,
      tokenId,
      price,
      ends,
      toptime,
      type,
    } = this.state;
    const { connected } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className="mt-20">{list ? "List NFT for Sale" : "Your NFTs"}</h1>
          {list ? (
            <span
              className="mt-10 cancel-button"
              onClick={() => {
                this.setState({ list: false });
              }}
            >
              Cancel
            </span>
          ) : null}
        </div>
        {connected ? (
          loading ? (
            <div className="spinner-container">
              <Spin size="large" />
            </div>
          ) : !status || !status1 ? (
            <Approve
              {...this.props}
              approve={this.approve}
              status={status}
              status1={status1}
            />
          ) : list ? (
            <div>
              <h1>
                # {parseInt(tokenId)}
                <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
                  Token Id
                </span>
              </h1>
              <span className="form-label">Auction Type</span> <br />
              <Radio.Group
                defaultValue={type}
                size="large"
                className="mt-20"
                onChange={(e) => {
                  this.setState({ type: e.target.value });
                }}
              >
                <Radio.Button value="auction">Auction</Radio.Button>
                <Radio.Button value="toptime">TopTime</Radio.Button>
              </Radio.Group>
              <br />
              <br />
              <span className="form-label">Auction Info</span>
              <input
                name="price"
                placeholder="Floor Price of Item (In USD)"
                onChange={(e) => this.handleChange(e)}
                value={price}
              />
              <p className="form-helper">
                {" "}
                Optional to add floor price. Bidders cannot bid below this price
                if specified. Default Value is 0 BTC and auction starts at 0
                BTC. <br />
              </p>
              {type === "auction" ? (
                <input
                  name="ends"
                  placeholder="Ending Time in Unix TimeStamp"
                  onChange={(e) => this.handleChange(e)}
                  value={ends}
                />
              ) : (
                <input
                  name="toptime"
                  placeholder="Top time in seconds"
                  onChange={(e) => this.handleChange(e)}
                  value={toptime}
                />
              )}
              <Button
                className="primary-button mt-40"
                onClick={() => {
                  this.listToken();
                }}
                loading={buttonLoading}
              >
                List For Sale
              </Button>
            </div>
          ) : (
            <div className="balances-grid">
              {balance === null
                ? null
                : balance.map((data, index) => {
                    return (
                      <NftCard
                        data={data}
                        key={index}
                        propsCall={this.propsCall}
                      />
                    );
                  })}
            </div>
          )
        ) : (
          <NotConnected {...this.props} />
        )}
      </div>
    );
  }
}

export default ListItem;
