// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import store, { persistor } from "./redux/store";
import { Loader } from "semantic-ui-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <Loader active size="large">
            جاري التحميل...
          </Loader>
        }
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
