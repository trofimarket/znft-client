import React, { useEffect, useState } from "react";
import BTC from "../../assets/coin-icons/btc.png";
import { uri } from "../../utils/nft-functions";
import { getFromLink } from "../../utils/ipfs";
import { countDownRenderer, fetchCurrentPrice } from "../../utils/helpers";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { PhotographIcon, UserIcon } from "@heroicons/react/outline";
import Countdown from "react-countdown";
import FixedPriceModal from "../Modals/FixedPrice";
import constants from "../../constants";

const AuctionItemCard = ({ data, auctionType, ...props }) => {
  const tokenId = data.tokenId;
  const currentTopTime =
    parseFloat(data.toptime) -
    (Date.now() / 1000 - parseFloat(data.highestBidAt));
  const [hash, setHash] = useState("");
  const [info, setInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModalVisible = () => {
    setModalVisible(!modalVisible);
  };

  const openMoreInfo = (auctionType, data) => {
    auctionType = auctionType.split("-").join("_");
    const moreInfoURL = `/market/${constants.AUCTION_TYPES[auctionType].name}/${data.id}`;
    props.history.push(moreInfoURL);
  };

  // Fetch Hash in useEffect hook
  useEffect(() => {
    let isMounted = true;

    const fetchHash = async () => {
      uri(tokenId).then((result) => {
        if (isMounted) {
          setHash(result);
        }
      });
    };

    fetchHash().then(() => console.log("We have the hash ", { hash }));

    // cleaning up to prevent memory leaks
    return function cleanup() {
      isMounted = false;
    };
  }, []);

  // Fetch Info in useEffect hook
  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      getFromLink(hash.uri).then((result) => {
        if (isMounted) {
          setInfo(result);
        }
      });
    };

    if (typeof hash === "object") {
      fetchInfo().then(() => console.log("We have the info ", { info }));
    }

    // cleaning up to prevent memory leaks
    return function cleanup() {
      isMounted = false;
    };
  }, [hash]);

  return (
    <div className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200 hover:shadow-lg">
      <div className="px-4 py-4">
        <div>
          <div className="h-64 block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
            {!info?.cover && (
              <PhotographIcon className="h-64 w-full object-cover" />
            )}

            {info?.cover && (
              <img
                src={`https://ipfs.trofi.one/ipfs/${info?.cover}`}
                alt={info?.cover}
                className="h-64 w-full object-cover"
              />
            )}
          </div>

          <div>
            <dl className="mt-2 mb-0">
              <div className="py-2 flex justify-between text-sm font-medium">
                <dt className="text-sm font-medium text-gray-500">
                  Current price
                </dt>
                <dd className="text-gray-900 flex items-center">
                  <img
                    src={BTC}
                    className="inline-block mr-2 h-5 w-5"
                    alt="btc-currency-img"
                  />{" "}
                  {fetchCurrentPrice(data)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {info?.title}
              </h2>
            </div>
          </div>

          <div>
            {auctionType === "FIXED-PRICE" && data.settlementHash && (
              <span className="px-3 py-2 text-red-800 text-xs font-medium bg-red-100 rounded-full">
                SALE ENDED
              </span>
            )}

            {auctionType === "FIXED-PRICE" && !data.settlementHash && (
              <button
                className="bg-green-500 text-white text-xs border border-transparent rounded-md px-3 py-2 font-medium hover:bg-transparent hover:border-green-500 hover:text-green-500"
                onClick={() => {
                  props.isWalletConnected
                    ? toggleModalVisible()
                    : props.modelOpen();
                }}
                type="button"
              >
                Buy Now
              </button>
            )}

            {auctionType === "TOP-TIME" &&
              data.highestBid &&
              currentTopTime > 0 && (
                <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {currentTopTime > 0 ? currentTopTime : 0} Seconds Left
                </span>
              )}

            {auctionType === "TOP-TIME" &&
              data.highestBid &&
              currentTopTime <= 0 && (
                <span className="px-3 py-2 text-red-800 text-xs font-medium bg-red-100 rounded-full">
                  SALE ENDED
                </span>
              )}

            {auctionType === "TOP-TIME" && !data.highestBid && (
              <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                Top Time: {data.toptime} Seconds Left
              </span>
            )}

            {auctionType === "TIME-BASED" && (
              <Countdown
                date={new Date(data.ends * 1000)}
                renderer={countDownRenderer}
              />
            )}
          </div>

          <div>
            <div className="mt-5 flex divide-x divide-gray-300">
              <div className="w-0 flex-1 flex">
                <a
                  href=""
                  onClick={() =>
                    window.open(
                      `https://kovan.etherscan.io/tx/${data.creationHash}`
                    )
                  }
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-2 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <ExternalLinkIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Hash</span>
                </a>
              </div>
              {auctionType === "FIXED-PRICE" && data.settlementHash && (
                <div className="-ml-px w-0 flex-1 flex">
                  <a
                    href=""
                    onClick={() =>
                      window.open(
                        `https://kovan.etherscan.io/tx/${data.settlementHash}`
                      )
                    }
                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-2 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                  >
                    <ExternalLinkIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-1 text-xs">Settlement</span>
                  </a>
                </div>
              )}
              <div className="-ml-px w-0 flex-1 flex">
                <a
                  href=""
                  onClick={() =>
                    props.history.push(`/merchant/${data.creator}`)
                  }
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-2 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <UserIcon
                    className="w-4 h-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Creator</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex mt-5">
            <button
              type="button"
              onClick={() => openMoreInfo(auctionType, data)}
              className="flex-1 w-full py-3 px-4 border border-transparent rounded-md shadow-sm bg-black  hover:bg-transparent text-sm font-medium text-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black hover:border-black"
            >
              More info
            </button>
          </div>
        </div>
      </div>

      <FixedPriceModal
        visible={modalVisible}
        toggleModal={toggleModalVisible}
        saleId={data.saleId}
        price={data.price}
        type="fixedprice"
        address={props.address}
        signer={props.signer}
      />
    </div>
  );
};

export default AuctionItemCard;
