import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateMerchant from "./dao/CreateMerchant";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={CreateMerchant} />
        </Switch>
      </BrowserRouter>
    );
  }
}
