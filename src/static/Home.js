import React from "react";
import { withRouter } from "react-router-dom";
import Section1 from "../assets/section1.svg";
import Section2 from "../assets/section2.svg";
import "./Home.css";

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>
            A Decentralized Marketplace.
            <br />
            <span> For REAL-WORLD assets.</span>
          </h1>
          <div className="button-container">
            <button className="primary-button">Join As Merchant.</button>
            <button className="secondary-button">
              Take me to Marketplace.
            </button>
          </div>
          <p>
            Bring anything you see around your to the Blockchain. Showcase,
            List, Buy & do more with your assets.
          </p>
        </div>
        <div className="section-1">
          <span>SIMPLE TO USE</span>
          <div className="label-div">
            <span className="label-1">1</span>
          </div>
          <div className="section-contents">
            <h2>Create and sell your NFT</h2>
            <div className="inner-section-content">
              <p>
                Once you’ve set up your wallet of choice, connect it to ZNFT by
                clicking the wallet icon in the top right corner. Learn about
                the wallets we support.
              </p>
              <p>
                Click Create NFT and set up your collection. Add social links, a
                description, profile & banner images, and set a secondary sales
                fee.
              </p>
            </div>
            <div className="inner-section-div">
              <img alt="section1" src={Section1} />
              <div>
                <h3>Anything to NFT.</h3>
                <p>
                  Upload your documents/images/videos representing the real
                  world asset, add a title and description, and customize your
                  NFTs with properties, stats, and unlockable content.
                </p>
                <h3>List them for Sale</h3>
                <p>
                  Choose between auctions, fixed-price listings, and
                  declining-price listings. You choose how you want to sell your
                  NFTs, and we help you sell them!
                </p>
                <h3>Payments</h3>
                <p>
                  All payments are handled via smart contract and hence is
                  completely decentralized and trustless
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="section-1">
          <span>DECENTRALIZED BUT POWERFUL</span>
          <div className="label-div">
            <span className="label-1">2</span>
          </div>
          <div className="section-contents">
            <h2>The internet of real-world assets</h2>
            <div className="inner-section-content">
              <p>
                Were not just another NFT platform. Anyone can become an owner
                by holding the shares of the platform. You can tokenize your
                assets and even sell them without any approvals/intermediary.
              </p>
              <p>
                Or you can also list and showcase your assets in a protected
                manner. Our information are stored safely on IPFS for added
                decentralization and security.
              </p>
            </div>
            <div className="inner-section-div reverse">
              <div>
                <h3>Open To All</h3>
                <p>
                  Anyone can become a seller with just a metamask wallet. You
                  can interact become a seller/buyer within seconds.
                </p>
                <h3>A Frontier for assets</h3>
                <p>
                  Our codes are open-source and transparent. We dont have
                  anything to us except the fee that you declare yourself.
                </p>
                <h3>All in One Hash</h3>
                <p>
                  We will encapsulate all your news information into just one
                  IPFS hash and store it on blockchain. Might be simple yet
                  powerful.
                </p>
              </div>
              <img alt="section2" src={Section2} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
