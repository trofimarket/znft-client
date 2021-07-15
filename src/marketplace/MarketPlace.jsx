import React, {useEffect, useState} from "react"
import Breadcrumbs from "../components/shared/Breadcrumbs";
import {auctions} from "../utils/queries/auction.query";
import {toptimes} from "../utils/queries/toptime.query";
import {fixedPrices} from "../utils/queries/fixedprice.query";
import AuctionItemCard from "../components/shared/AuctionItemCard";

const MarketPlace = ({history, ...props}) => {
    const [timeBasedAuctions, setTimeBasedAuctions] = useState([])
    const [topTimeAuctions, setTopTimeAuctions] = useState([])
    const [fixedPriceAuctions, setFixedPriceAuctions] = useState([])

    useEffect(() => {
        let subscribed = true

        auctions().then(result => {
            if (subscribed) {
                setTimeBasedAuctions(result)
            }
        })

        toptimes().then(result => {
            if (subscribed) {
                setTopTimeAuctions(result)
            }
        })

        fixedPrices().then(result => {
            if (subscribed) {
                setFixedPriceAuctions(result)
            }
        })

        return () => subscribed = false
    }, [])

    console.log({timeBasedAuctions})

    return (
        <div>
            <Breadcrumbs path={["Marketplace"]}/>
            <main>
                <div className="w-full mx-auto">
                    <div className="px-4 py-8 sm:px-0">
                        <h1 className="text-2xl">Time based Auctions</h1>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {timeBasedAuctions.map(auction => (
                                <AuctionItemCard data={auction} key={auction.id} history={history} auctionType={"TIME-BASED"} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto">
                    <div className="px-4 py-8 sm:px-0">
                        <h1 className="text-2xl">Top-Time Auctions</h1>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {topTimeAuctions.map(auction => (
                                <AuctionItemCard data={auction} key={auction.id} history={history} auctionType={"TOP-TIME"} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto">
                    <div className="px-4 py-8 sm:px-0">
                        <h1 className="text-2xl">Fixed-Price Sales</h1>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {fixedPriceAuctions.map(auction => (
                                <AuctionItemCard
                                    data={auction}
                                    key={auction.id}
                                    history={history}
                                    auctionType={"FIXED-PRICE"}
                                    modelOpen={props.open}
                                    isWalletConnected={props.connected}
                                    address={props.address}
                                    signer={props.signer}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default MarketPlace