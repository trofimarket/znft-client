export const fetchCurrentPrice = (auctionData) => {
  let currentPrice = 0;

  if (!auctionData) {
    return currentPrice;
  }

  if (auctionData["highestBid"]) {
    currentPrice = auctionData["highestBid"];
  } else if (auctionData["price"]) {
    currentPrice = auctionData["price"];
  } else {
    currentPrice = auctionData["listingPrice"];
  }

  return parseInt(currentPrice) / 10 ** 8;
};

export const countDownRenderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <span className="px-3 py-3 text-red-800 text-xs font-medium bg-red-100 rounded-full">
        SALE ENDED
      </span>
    );
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
    return " - ";
  }

  const prefix = String(address).substring(0, 10);
  const postfix = String(address).substring(
    address.length - 10,
    address.length
  );

  return `${prefix}.......${postfix}`;
};
