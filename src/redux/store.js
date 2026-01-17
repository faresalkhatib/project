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
import teacherSubjectsReducer from "./teacherSubjectsSlice";
import maintenanceReducer from "./maintenanceSlice";

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
  teacherSubjects: teacherSubjectsReducer,
  maintenance: maintenanceReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "bookings/subscribeToAllBookings/fulfilled",
          "bookings/subscribeToStudentBookings/fulfilled",
          "bookings/subscribeToTeacherBookings/fulfilled",
          "classrooms/subscribeToClassrooms/fulfilled",
          "maintenance/subscribeToAllComplaints/fulfilled",
          "maintenance/subscribeToUserComplaints/fulfilled",
        ],
        ignoredPaths: [
          "bookings.unsubscribe",
          "classrooms.unsubscribe",
          "maintenance.unsubscribe",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
