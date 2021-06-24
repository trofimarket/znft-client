import React from "react";
import { Button, Spin } from "antd";
import NftCard from "../components/NftCard/NftCard";
import { approve, checkApproval } from "../utils/nft-functions";
import { balances } from "../utils/queries/nft.query";
import { list } from "../utils/auction-functions";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      status: false,
      loading: true,
      buttonLoading: false,
      list: false,
      tokenId: null,
      price: "",
      ends: "",
    };
    this.propsCall = this.propsCall.bind(this);
  }

  async componentDidMount() {
    if (this.props.address) {
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

  async fetchBalance() {
    const balance = await balances(this.props.address);
    this.setState({ balance });
  }

  approve() {
    this.setState({ buttonLoading: true }, async () => {
      const tx = await approve(this.props.signer);
      console.log(tx);
      if (!tx.error) {
        this.setState({ status: true, buttonLoading: false });
      } else {
        this.setState({ buttonLoading: false });
      }
    });
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
    return (
      <div>
        <h1 className="mt-20">Your NFTs</h1>
        {loading ? (
          <div className="spinner-container">
            <Spin size="large" />
          </div>
        ) : !status ? (
          <Button loading={buttonLoading} onClick={() => this.approve()}>
            Approve Now
          </Button>
        ) : list ? (
          <div>
            <span className="form-label">Listing Info</span>
            <p>{tokenId}</p>
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
            <br />
            <br />
            <Button
              onClick={() => {
                this.listToken();
              }}
              loading={buttonLoading}
            >
              List For Sale
            </Button>
            <br />
            <br />
            <Button
              onClick={() => {
                this.setState({ list: false });
              }}
            >
              Cancel
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
        )}
      </div>
    );
  }
}

export default ListItem;
