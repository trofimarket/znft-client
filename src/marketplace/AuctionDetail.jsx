import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Breadcrumbs from "../components/shared/Breadcrumbs";
import { auctionInfo, bids } from "../utils/queries/auction.query";
import { uri } from "../utils/nft-functions";
import { getFromLink } from "../utils/ipfs";
import {
  countDownRenderer,
  fetchCurrentPrice,
  truncateAddress,
} from "../utils/helpers";
import BTC from "../assets/coin-icons/btc.png";
import Countdown from "react-countdown";
import { PaperClipIcon, PhotographIcon } from "@heroicons/react/outline";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import MarkdownViewer from "../components/shared/MarkdownViewer";
import PlaceBid from "./PlaceBid";
import { auctionActions } from "../store/actions";
import constants from "../constants";
import { toptimeInfo } from "../utils/queries/toptime.query";

const AuctionDetail = ({ match, startNewBid, ...props }) => {
  const { auctionId, auctionType } = match.params;
  const [auctionDetail, setAuctionDetail] = useState({});
  const [selectedAuctionDetail, selectAuctionDetail] = useState(null);
  const [auctionBids, setAuctionBids] = useState([]);
  const [auctionHash, setAuctionHash] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
  const [auctionTime, setAuctionTime] = useState(0);

  console.log({ auctionType });

  const onPlaceBid = (auctionItem) => {
    selectAuctionDetail(auctionItem);
    startNewBid();
  };

  // Fetch Info in useEffect hook
  useEffect(() => {
    let isMounted = true;

    switch (auctionType) {
      case constants.AUCTION_TYPES.TOP_TIME.name:
        toptimeInfo(auctionId).then((results) => {
          if (isMounted) {
            const result = results[0];
            const time =
              parseFloat(result.toptime) -
              (Date.now() / 1000 - parseFloat(result["highestBidAt"]));
            setAuctionDetail(result);
            setAuctionTime(time);
          }
        });

        break;
      default:
        auctionInfo(auctionId).then((result) => {
          if (isMounted) {
            setAuctionDetail(result[0]);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [auctionId, auctionType]);

  // Fetch Bids in useEffect hook
  useEffect(() => {
    let isMounted = true;

    bids(auctionId).then((result) => {
      if (isMounted) {
        setAuctionBids(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [auctionId]);

  // Fetch Hash in useEffect hook
  useEffect(() => {
    let isMounted = true;

    if (auctionDetail?.tokenId) {
      uri(auctionDetail?.tokenId).then((result) => {
        if (isMounted) {
          setAuctionHash(result);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [auctionDetail?.tokenId]);

  // Fetch Info in useEffect hook
  useEffect(() => {
    let isMounted = true;

    if (auctionHash?.uri) {
      getFromLink(auctionHash?.uri).then((result) => {
        if (isMounted) {
          setItemInfo(result);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [auctionHash?.uri]);

  return (
    <div className="max-w mx-auto">
      <Breadcrumbs path={["Auction", `${itemInfo?.title}`]} />
      <div className="max-w-5xl mx-auto mt-12">
        <div className="w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0 inline-block">
              <div className="relative">
                <img
                  className="h-14 w-14 rounded-full"
                  src={BTC}
                  alt="btc-icon"
                />
                <span
                  className="absolute inset-0 shadow-inner rounded-full"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl text-gray-900 mb-0">
                {fetchCurrentPrice(auctionDetail)}
              </h1>
              <p className="text-sm font-medium text-gray-500 mb-0">
                Current price
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
            {auctionType === constants.AUCTION_TYPES.TOP_TIME.name && (
              <>
                <span className="px-3 py-3 text-green-800 text-xs font-medium bg-white rounded-full">
                  <span className="text-gray-500 font-semibold">Top Time</span>{" "}
                  {auctionDetail?.toptime} Secs
                </span>

                <span className="px-3 py-3 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {auctionTime > 0 ? auctionTime : 0} Seconds Left
                </span>
              </>
            )}

            {auctionType === constants.AUCTION_TYPES.TIME_BASED.name && (
              <Countdown
                date={new Date(auctionDetail.ends * 1000)}
                renderer={countDownRenderer}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              />
            )}

            <button
              onClick={() => onPlaceBid(auctionDetail)}
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gree-500"
            >
              Bid Now
            </button>
          </div>
        </div>
        <div className="mt-8 w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="space-y-6 w-full">
            <section>
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    {itemInfo?.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Sold by{" "}
                    <span className="text-gray-900">
                      {auctionDetail?.creator &&
                        truncateAddress(auctionDetail?.creator)}
                    </span>
                  </p>
                </div>

                <div className="border-t border-b border-gray-200">
                  {!itemInfo?.cover && (
                    <PhotographIcon className="h-96 w-full object-cover" />
                  )}

                  {itemInfo?.cover && (
                    <img
                      src={`https://ipfs.trofi.one/ipfs/${itemInfo?.cover}`}
                      alt={itemInfo?.cover}
                      className="h-96 w-full object-cover"
                    />
                  )}
                </div>

                <div className="px-4 py-5 sm:px-6 mt-5">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Creator
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        <a
                          href=""
                          onClick={() =>
                            props.history.push(
                              `/merchant/${auctionDetail?.creator}`
                            )
                          }
                          className="text-gray-900 flex items-center underline"
                        >
                          {truncateAddress(auctionDetail?.creator)}
                          <ExternalLinkIcon
                            className="w-6 h-5 text-gray-900 inline-block ml-1"
                            aria-hidden="true"
                          />
                        </a>
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Creation Hash
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        <a
                          href=""
                          onClick={() =>
                            window.open(
                              `https://kovan.etherscan.io/tx/${auctionDetail?.creationHash}`
                            )
                          }
                          className="text-gray-900 flex items-center underline"
                        >
                          {truncateAddress(auctionDetail?.creationHash)}
                          <ExternalLinkIcon
                            className="w-6 h-5 text-gray-900 inline-block ml-1"
                            aria-hidden="true"
                          />
                        </a>
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Settlement
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        {!auctionDetail?.settlementHash && "-"}
                        {auctionDetail?.settlementHash &&
                          truncateAddress(auctionDetail?.settlementHash)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        {itemInfo?.description}
                      </dd>
                    </div>

                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Properties
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        {itemInfo?.markdownHash && (
                          <MarkdownViewer
                            markdownHash={itemInfo?.markdownHash}
                          />
                        )}

                        {!itemInfo?.markdownHash && "-"}
                      </dd>
                    </div>

                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Files
                      </dt>
                      <dd className="mt-4 text-sm text-gray-900">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {itemInfo?.files.map((attachment, idx) => (
                            <li
                              key={idx}
                              className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                            >
                              <div className="w-0 flex-1 flex items-center">
                                <PaperClipIcon
                                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-2 flex-1 w-0 truncate">
                                  {truncateAddress(attachment)}
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a
                                  onClick={() =>
                                    window.open(
                                      `https://ipfs.trofi.one/ipfs/${attachment}`
                                    )
                                  }
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                  Download
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
            <section>
              <div className="bg-white shadow sm:rounded-lg mb-5">
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="notes-title"
                      className="text-lg font-medium text-gray-900"
                    >
                      Bids
                    </h2>
                  </div>
                  <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Bidder
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Currency
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Paid
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total Bid
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Hash
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {auctionBids.map((bid, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <a
                                href={`https://kovan.etherscan.io/address/${bid.bidder}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-900 underline"
                              >
                                {truncateAddress(bid.bidder)}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {bid.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {bid.paid / 10 ** 8} BTC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {bid.amount / 10 ** 8} BTC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <a
                                href={`https://kovan.etherscan.io/address/${bid.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-900 underline"
                              >
                                {truncateAddress(bid.id)}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {selectedAuctionDetail && (
        <PlaceBid auctionItem={selectedAuctionDetail} saleType={"auction"} />
      )}
    </div>
  );
};

export default withRouter(
  connect(null, {
    startNewBid: auctionActions.startNewBid,
  })(AuctionDetail)
);
