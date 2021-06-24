import React from "react";
import { Button, Spin } from "antd";
import NftCard from "../components/NftCard/NftCard";
import { checkApproval } from "../utils/nft-functions";
import { balances } from "../utils/queries/nft.query";
import { list } from "../utils/auction-functions";
import NotConnected from "../components/States/NotConnected";
import Approve from "./approve";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      status: false,
      loading: true,
      buttonLoading: false,
      list: false,
      tokenId: "",
      price: "",
      ends: "",
    };
    this.propsCall = this.propsCall.bind(this);
    this.approve = this.approve.bind(this);
  }

  async componentDidMount() {
    if (this.props.connected) {
      const approval = await checkApproval(this.props.address);
      console.log(approval);
      if (!approval.error) {
        this.setState({
          status: approval.status,
          loading: false,
        });
        this.fetchBalance();
      }
    }
  }

  async componentDidUpdate() {
    if (this.props.address && this.state.loading) {
      const approval = await checkApproval(this.props.address);
      if (!approval.error) {
        this.setState({
          status: approval.status,
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

  approve() {
    this.setState({ status: true });
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
      const { price, ends, tokenId } = this.state;
      const tx = await list(tokenId, price, ends, this.props.signer);
      if (tx) {
        this.setState({ buttonLoading: false });
      }
    });
  }

  render() {
    const {
      balance,
      loading,
      status,
      buttonLoading,
      list,
      tokenId,
      price,
      ends,
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
          ) : !status ? (
            <Approve {...this.props} approve={this.approve} />
          ) : list ? (
            <div>
              <h1>
                # {parseInt(tokenId)}
                <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
                  Token Id
                </span>
              </h1>
              <span className="form-label">Auction Info</span>
              <input
                name="price"
                placeholder="Price of Item (In USD)"
                onChange={(e) => this.handleChange(e)}
                value={price}
              />
              <input
                name="ends"
                placeholder="Ending Time in Unix TimeStamp"
                onChange={(e) => this.handleChange(e)}
                value={ends}
              />
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
