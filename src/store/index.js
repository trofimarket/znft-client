import { applyMiddleware, compose, createStore } from "redux";
import reducers from "./reducers";
import thunk from "redux-thunk";
import throttle from "lodash/throttle";
import { composeWithDevTools } from "redux-devtools-extension";
import StorageService from "../services/Storage";

const composeEnhancers = (middleware) => {
  if (process.env.NODE_ENV === "development") {
    return composeWithDevTools(middleware);
  }

  return compose(middleware);
};

const stateFromStorage = StorageService.load("trofi-state");
const store = createStore(
  reducers,
  stateFromStorage,
  composeEnhancers(applyMiddleware(thunk))
);

// Save state at most once in a second
store.subscribe(
  throttle(() => {
    StorageService.save("trofi-state", {
      wallet: store.getState()["wallet"],
    });
  }, 1000)
);

export default store;
