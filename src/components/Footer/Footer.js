import React from "react";
import { withRouter } from "react-router-dom";
import "./Footer.css";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer-container">
          <p>Copyright © 2021 ZNFT. All rights reserved.</p>
          <div>
            <ul>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
