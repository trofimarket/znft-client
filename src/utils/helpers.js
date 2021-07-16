export const fetchCurrentPrice = (auctionData) => {
    if (auctionData['highestBid']) {
        return auctionData['highestBid'] / 10 ** 8
    }

    if (auctionData['price']) {
        return auctionData['price'] / 10 ** 8
    }

    return auctionData['listingPrice'] / 10 ** 8
}

export const countDownRenderer = ({hours, minutes, seconds, completed}) => {
    if (completed) {
        // Render a completed state
        return (
            <span className="px-3 py-3 text-red-800 text-xs font-medium bg-red-100 rounded-full">SALE ENDED</span>);
    } else {
        // Render a countdown
        return (
            <span className="px-3 py-3 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    {hours} Hours {minutes} Mins {seconds} Seconds
                </span>
        );
    }
};

export const truncateAddress = (address) => {
    if (!address) {
        return " - "
    }

    const prefix = String(address).substring(0, 10)
    const postfix = String(address).substring(
        address.length - 10, address.length
    )

    return `${prefix}.......${postfix}`
}
