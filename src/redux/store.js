// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import bookingReducer from "./bookingSlice";
import classroomReducer from "./classroomSlice";
import modalReducer from "./modalSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  bookings: bookingReducer,
  classrooms: classroomReducer,
  modals: modalReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
