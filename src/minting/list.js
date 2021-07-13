import React from "react";
import { Button, Radio, Spin } from "antd";
import NftCard from "../components/NftCard/NftCard";
import { checkApprovalAuction, checkApprovalTopTime, checkFixedTimeApproval, } from "../utils/nft-functions";
import { balances } from "../utils/queries/nft.query";
import { createAuction } from "../utils/auction-functions";
import { createTopTime } from "../utils/toptime-functions";
import NotConnected from "../components/States/NotConnected";
import Approve from "./approve";
import { listingFee, merchantStatus } from "../utils/dao-functions";
import { notify } from "../utils/general-functions";
import { createFixedPriceSale } from "../utils/fixedprice-functions";

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: null,
            status: false,
            status1: false,
            status2: false,
            loading: true,
            buttonLoading: false,
            list: false,
            tokenId: "",
            price: "0",
            ends: "",
            toptime: "",
            type: "auction",
            validating: null,
            fee: "",
        };
        this.propsCall = this.propsCall.bind(this);
        this.approve = this.approve.bind(this);
    }



    async componentDidMount() {
        if (this.props.connected) {
            const approval = await checkApprovalAuction(this.props.address);
            const approval2 = await checkApprovalTopTime(this.props.address);
            const approval3 = await checkFixedTimeApproval(this.props.address);
            if (!approval.error && !approval2.error && !approval3.error) {
                this.setState({
                    status: approval.status,
                    status1: approval2.status,
                    status2: approval3.status,
                    loading: false,
                });
                this.fetchBalance();
                this.fetchFee();
            }
        }
    }

    async componentDidUpdate() {
        if (this.props.address && this.state.loading) {
            const approval = await checkApprovalAuction(this.props.address);
            const approval2 = await checkApprovalTopTime(this.props.address);
            const approval3 = await checkFixedTimeApproval(this.props.address);
            if (!approval.error && !approval2.error && !approval3.error) {
                this.setState({
                    status: approval.status,
                    status1: approval2.status,
                    status2: approval3.status,
                    loading: false,
                });
                this.fetchBalance();
                this.fetchFee();
            }
        }
    }

    async fetchBalance() {
        const balance = await balances(this.props.address);
        this.setState({ balance });
    }

    async fetchFee() {
        const fee = await listingFee(this.props.address);
        this.setState({ fee: fee.fee });
    }

    approve(type) {
        if (type === "auction") {
            this.setState({ status: true });
        } else if (type === "toptime") {
            this.setState({ status1: true });
        } else {
            this.setState({ status2: true });
        }
    }

    async propsCall(id) {
        this.setState({ validating: id });
        const result = await merchantStatus(this.props.address);
        if (!result.error) {
            if (result.status) {
                this.setState({
                    list: true,
                    tokenId: id,
                    validating: null,
                });
            } else {
                notify(
                    "error",
                    "Merchant not approved to sell on platform",
                    "please list your company for sale",
                    null
                );
                this.setState({ validating: null });
            }
        } else {
            this.setState({ validating: null });
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    listToken() {
        this.setState({ buttonLoading: true }, async () => {
            const { price, ends, tokenId, toptime, type, fee } = this.state;
            if (type === "auction") {
                const tx = await createAuction(
                    tokenId,
                    price,
                    ends,
                    fee,
                    this.props.signer
                );
                if (tx) {
                    this.setState({ buttonLoading: false });
                }
            } else if (type === "toptime") {
                const tx = await createTopTime(
                    tokenId,
                    price,
                    toptime,
                    fee,
                    this.props.signer
                );
                if (tx) {
                    this.setState({ buttonLoading: false });
                }
            } else {
                const tx = await createFixedPriceSale(
                    tokenId,
                    price,
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
            status2,
            buttonLoading,
            list,
            tokenId,
            price,
            ends,
            toptime,
            type,
            validating,
            fee,
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
                    ) : !status || !status1 || !status2 ? (
                        <Approve
                            {...this.props}
                            approve={this.approve}
                            status={status}
                            status1={status1}
                            status2={status2}
                        />
                    ) : list ? (
                        <div>
                            <h1>
                                # {parseInt(tokenId)}
                                <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
                                    Token Id
                                </span>
                            </h1>
                            <span className="form-label">Listing Fee</span> <br />
                            <h1>
                                {fee}{" "}
                                <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
                                    ETH
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
                                <Radio.Button value="fixedprice">Fixed Price</Radio.Button>
                            </Radio.Group>
                            <br />
                            <br />
                            <span className="form-label">
                                {type === "fixedprice" ? "Sale Info" : "Auction Info"}
                            </span>
                            <input
                                name="price"
                                placeholder="Price of Item (In BTC)"
                                onChange={(e) => this.handleChange(e)}
                                value={price}
                            />
                            <p className="form-helper">
                                {" "}
                                {type === "fixedprice"
                                    ? "Price of your token for sale."
                                    : "Optional to add floor price. Bidders cannot bid below this price if specified. Default Value is 0 BTC and auction starts at 0 BTC."}{" "}
                                <br />
                            </p>
                            {type === "fixedprice" ? null : type === "auction" ? (
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
                                            validating={validating}
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
