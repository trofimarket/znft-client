import React from "react";
import { withRouter } from "react-router-dom";
import Section1 from "../assets/section1.svg";
import Section2 from "../assets/rolex.png";
import "./Home.css";

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>
            Trade rare physical assets
            <br />
            <span>as easily as crypto</span>
          </h1>
          <div className="button-container">
            <button
              className="primary-button"
              onClick={() => {
                this.props.history.push("/create");
              }}
            >
              Join As Merchant.
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                this.props.history.push("/marketplace");
              }}
            >
              Take me to Marketplace.
            </button>
          </div>
        </div>
        <div className="section-1">
          <div className="section-contents">
            <div className="inner-section-content">
              <p>
                Merchants must be approved by TroFi shareholders before they
                are able to list items for sale. Shareholders only approve
                solid merchants with an impeccable history and reputation.
              </p>
              <p>
                Auction winners can request delivery of the physical asset,
                or can leave the physical asset in the custody of the merchant
                so that it can be re-auctioned at a later date.
              </p>
            </div>
            <div className="inner-section-div reverse">
              <div>
                <h3>Trophy Assets Only</h3>
                <p>
                  All listings on TroFi are rare, valuable trophy assets.
                </p>
                <h3>Validated Merchants</h3>
                <p>
                  TroFi Merchants must be validated by shareholders to ensure
                  that only the best of the best may participate.
                </p>
                <h3>Anyone can bid</h3>
                <p>
                  Anyone can bid on listed assets. Simple connect your Metamask
                  wallet, as easy as any other DeFi application.
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