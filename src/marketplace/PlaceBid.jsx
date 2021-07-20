import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { auctionActions } from "../store/actions";
import { fetchCurrentPrice } from "../utils/helpers";
import { Button, Select } from "antd";
import constants from "../constants";
import {
  bidAuction,
  estimate as getEstimate,
} from "../utils/auction-functions";
import {
  allowanceToken,
  approveToken,
  balanceToken,
} from "../utils/payment-functions";
import { platformTax as getPlatformTax } from "../utils/dao-functions";
import { notify } from "../utils/general-functions";
import { bidTopTime } from "../utils/toptime-functions";

const PlaceBid = ({
  auctionItem,
  saleType,
  userWallet,
  userAuction,
  cancelNewBid,
}) => {
  console.log({ auctionItem });
  const { Option } = Select;

  const [currentAsset, selectAsset] = useState(constants.ASSETS.ETH);
  const [bidAmount, setBidAmount] = useState("");
  const [estimate, setEstimate] = useState("");
  const [estimated, setEstimated] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [approved, setApproved] = useState(false);
  const [platformTax, setPlatformTax] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const [biddingLoading, setBiddingLoading] = useState(false);

  const approve = () => {
    setApproveLoading(true);
    approveToken(currentAsset, estimate, saleType, userWallet.signer).then(
      (resp) => {
        if (resp.error) {
          setApproveLoading(false);
          return;
        }

        setApproveLoading(false);
        setApproved(true);
      }
    );
  };

  const placeBid = async () => {
    setBiddingLoading(true);
    const balance = await balanceToken(currentAsset, userWallet.address);

    if (
      parseFloat(auctionItem["highestBid"]) >
      parseFloat(bidAmount * 10 ** 10) / platformTax
    ) {
      notify(
        "warning",
        "Bid higher amount",
        "A bidder placed bid for higher amount than yours",
        null
      );
      setBiddingLoading(false);
    } else if (parseFloat(balance.balance) < parseFloat(estimate)) {
      notify(
        "warning",
        "Insufficient Balance",
        `Please check whether your wallet has sufficient ${currentAsset} balance `,
        null
      );
      setBiddingLoading(false);
    } else {
      let result;

      if (saleType === "auction") {
        result = await bidAuction(
          currentAsset,
          bidAmount,
          auctionItem.id,
          userWallet.signer
        );
      } else {
        result = await bidTopTime(
          currentAsset,
          bidAmount,
          auctionItem.id,
          userWallet.signer
        );
      }

      if (result.error) {
        setBiddingLoading(false);
      } else {
        setBiddingLoading(false);
        cancelNewBid();
      }
    }
  };

  const onAssetChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    selectAsset(event.target.value);
  };

  const onChangeAmount = async (event) => {
    event.preventDefault();
    setBidAmount(event.target.value);

    if (parseFloat(bidAmount) > 0) {
      setEstimated(false);
      setEstimating(true);

      const estimateAmount = await getEstimate(currentAsset, bidAmount, 1);
      const approval = await allowanceToken(
        currentAsset,
        userWallet.address,
        saleType
      );

      if (!estimateAmount.error && !approval.error) {
        setEstimate(estimateAmount.amount);

        if (
          parseFloat(approval.approval) >= parseFloat(estimateAmount.amount)
        ) {
          setApproved(true);
          setEstimated(true);
          setEstimating(false);
        } else {
          setApproved(false);
          setEstimated(true);
          setEstimating(false);
        }
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const assignPlatformTax = async (creatorAddress) => {
      getPlatformTax(creatorAddress).then((resp) => {
        if (isMounted) {
          setPlatformTax(resp.tax);
        }
      });
    };

    assignPlatformTax(auctionItem?.creator).then(() => {
      console.log({ platformTax });
    });

    return () => {
      isMounted = false;
    };
  }, [auctionItem?.creator]);

  return (
    <Transition.Root show={userAuction.isBidStarted} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={userAuction.isBidStarted}
        onClose={cancelNewBid}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="">
                  <Dialog.Title
                    as="h2"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Placing Bid for Item {auctionItem?.id}
                  </Dialog.Title>
                  <div>
                    <p>
                      Current Price <br />
                      <span className="special-text">
                        BTC {fetchCurrentPrice(auctionItem)}
                      </span>
                    </p>
                  </div>
                  <div className="mt-2">
                    <div>
                      <p>
                        Current Price <br />
                        <span className="special-text">
                          BTC {fetchCurrentPrice(auctionItem)}
                        </span>
                      </p>
                      <p>
                        Pay With <br />
                        <span className="special-text">
                          <img
                            className="coin-icon"
                            src={constants.LOGOS[currentAsset].url}
                            alt={currentAsset}
                          />{" "}
                          {currentAsset}
                        </span>
                      </p>
                    </div>

                    <span className="form-label">Bid Info</span>
                    <div className="mt-20 ">
                      <select
                        defaultValue={currentAsset}
                        onChange={onAssetChange}
                        className="border border-gray-200 w-full px-3 py-4 rounded-md"
                      >
                        <option value={constants.ASSETS.ETH}>Ethereum</option>
                        <option value={constants.ASSETS.BTC}>Bitcoin</option>
                      </select>
                      <input
                        name="bidAmount"
                        placeholder="Lock-In Amount in BTC"
                        onChange={(e) => onChangeAmount(e)}
                        value={bidAmount}
                      />
                    </div>
                    <div className="mt-20 ">
                      <span className="form-label">Estimate </span>
                      <br />
                      <p>
                        {estimate ? parseFloat(estimate).toFixed(8) : 0.0}{" "}
                        {currentAsset}
                      </p>
                    </div>
                    <div className="mt-20 ">
                      <span className="form-label">Final Settlement </span>
                      <br />
                      <p>
                        {estimate
                          ? parseFloat(
                              (parseFloat(estimate) * 100) /
                                parseFloat(platformTax)
                            ).toFixed(8)
                          : 0.0}{" "}
                        {currentAsset}
                      </p>
                    </div>
                    <div className="mt-20 ">
                      <span className="form-label">Total Bid Value </span>
                      <br />
                      <p>
                        {bidAmount
                          ? parseFloat(
                              (parseFloat(bidAmount) * 100) /
                                parseFloat(platformTax)
                            ).toFixed(8)
                          : 0.0}{" "}
                        BTC
                      </p>
                    </div>
                    <div className="mt-20">
                      {!estimated ? (
                        <Button
                          loading={estimating}
                          className="primary-button"
                          disabled
                        >
                          Enter Input Values
                        </Button>
                      ) : !approved ? (
                        <Button
                          className="primary-button"
                          onClick={approve}
                          loading={approveLoading}
                        >
                          Approve Tokens
                        </Button>
                      ) : (
                        <Button
                          className="primary-button"
                          onClick={placeBid}
                          loading={biddingLoading}
                        >
                          Bid Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const mapStateToProps = (state) => {
  return {
    userAuction: state.auction,
    userWallet: state.wallet,
  };
};
export default connect(mapStateToProps, {
  cancelNewBid: auctionActions.cancelNewBid,
})(PlaceBid);
