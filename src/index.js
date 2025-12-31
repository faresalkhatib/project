import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import store, { persistor } from "./redux/store";
import { Loader } from "semantic-ui-react";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

const LoadingWithTranslation = () => {
  const { t } = useLanguage();
  return (
    <Loader active size="large">
      {t("loading")}
    </Loader>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <Provider store={store}>
        <PersistGate loading={<LoadingWithTranslation />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </LanguageProvider>
  </React.StrictMode>
);
