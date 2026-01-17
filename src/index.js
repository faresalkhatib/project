import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import store, { persistor } from "./redux/store";
import { Loader } from "semantic-ui-react";

import "./utils/i18n.ts"; // ← REQUIRED

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
