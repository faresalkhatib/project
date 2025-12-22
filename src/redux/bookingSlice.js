// src/redux/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../api/firebase";

/* ===================== CHECK BOOKING CONFLICT ===================== */
export const checkBookingConflict = createAsyncThunk(
  "bookings/checkConflict",
  async ({ classroom, date, startTime, endTime }, { rejectWithValue }) => {
    try {
      if (!classroom || !date || !startTime || !endTime) {
        return rejectWithValue("Missing required fields for conflict check");
      }

      const bookingsRef = collection(db, "bookings");

      // Query for bookings in the same classroom and date
      const q = query(
        bookingsRef,
        where("classroom", "==", classroom),
        where("date", "==", date),
        where("status", "in", ["approved", "pending"])
      );

      const snapshot = await getDocs(q);

      // Check for time overlap
      for (const doc of snapshot.docs) {
        const booking = doc.data();
        const existingStart = booking.startTime;
        const existingEnd = booking.endTime;

        // Check if times overlap
        const hasOverlap =
          (startTime >= existingStart && startTime < existingEnd) ||
          (endTime > existingStart && endTime <= existingEnd) ||
          (startTime <= existingStart && endTime >= existingEnd);

        if (hasOverlap) {
          return {
            hasConflict: true,
            message: "القاعة محجوزة",
            conflictingBooking: {
              id: doc.id,
              ...booking,
            },
          };
        }
      }

      return { hasConflict: false, message: null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SUBSCRIBE TO ALL BOOKINGS (ADMIN) ===================== */
export const subscribeToAllBookings = createAsyncThunk(
  "bookings/subscribeToAllBookings",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const bookingsRef = collection(db, "bookings");

      const unsubscribe = onSnapshot(
        bookingsRef,
        (snapshot) => {
          const bookings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch(setBookings(bookings));
        },
        (error) => {
          dispatch(setError(error.message));
        }
      );

      return unsubscribe;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SUBSCRIBE TO STUDENT BOOKINGS ===================== */
export const subscribeToStudentBookings = createAsyncThunk(
  "bookings/subscribeToStudentBookings",
  async (registeredSubjects, { dispatch, rejectWithValue }) => {
    try {
      if (
        !Array.isArray(registeredSubjects) ||
        registeredSubjects.length === 0
      ) {
        dispatch(setBookings([]));
        return null;
      }

      const validSubjects = registeredSubjects.filter(
        (sub) =>
          sub?.subjectNumber !== undefined &&
          sub?.subjectSubNumber !== undefined
      );

      if (validSubjects.length === 0) {
        dispatch(setBookings([]));
        return null;
      }

      const bookingsRef = collection(db, "bookings");
      const unsubscribes = [];

      // Create a Map to track unique bookings
      const bookingsMap = new Map();

      // Subscribe to each subject's bookings
      for (const sub of validSubjects) {
        const q = query(
          bookingsRef,
          where("subjectNumber", "==", sub.subjectNumber),
          where("subjectSubNumber", "==", sub.subjectSubNumber),
          where("status", "==", "approved")
        );

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            snapshot.docs.forEach((doc) => {
              bookingsMap.set(doc.id, { id: doc.id, ...doc.data() });
            });

            // Convert Map to array and update state
            const bookings = Array.from(bookingsMap.values());
            dispatch(setBookings(bookings));
          },
          (error) => {
            dispatch(setError(error.message));
          }
        );

        unsubscribes.push(unsubscribe);
      }

      // Return cleanup function
      return () => {
        unsubscribes.forEach((unsub) => unsub());
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SUBSCRIBE TO TEACHER BOOKINGS ===================== */
export const subscribeToTeacherBookings = createAsyncThunk(
  "bookings/subscribeToTeacherBookings",
  async (teacherId, { dispatch, rejectWithValue }) => {
    try {
      if (!teacherId) {
        dispatch(setBookings([]));
        return null;
      }

      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("teacherId", "==", teacherId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const bookings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch(setBookings(bookings));
        },
        (error) => {
          dispatch(setError(error.message));
        }
      );

      return unsubscribe;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== CREATE BOOKING ===================== */
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue, dispatch }) => {
    try {
      if (!bookingData || typeof bookingData !== "object") {
        return rejectWithValue("Invalid booking data");
      }

      // Check for conflicts before creating
      const conflictCheck = await dispatch(
        checkBookingConflict({
          classroom: bookingData.classroom,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
        })
      ).unwrap();

      if (conflictCheck.hasConflict) {
        return rejectWithValue("القاعة محجوزة");
      }

      const bookingsRef = collection(db, "bookings");

      const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      return {
        id: docRef.id,
        ...bookingData,
        status: "pending",
      };
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

/* ===================== UPDATE BOOKING STATUS ===================== */
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      if (!bookingId || !status) {
        return rejectWithValue("Invalid booking update data");
      }

      const bookingRef = doc(db, "bookings", bookingId);

      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now(),
      });

      return { bookingId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== DELETE BOOKING ===================== */
export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      if (!bookingId) {
        return rejectWithValue("Invalid booking id");
      }

      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);

      return bookingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SLICE ===================== */
const initialState = {
  bookings: [],
  loading: false,
  error: null,
  successMessage: null,
  conflictCheck: null,
  unsubscribe: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.conflictCheck = null;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUnsubscribe: (state, action) => {
      state.unsubscribe = action.payload;
    },
    cleanup: (state) => {
      if (state.unsubscribe) {
        if (typeof state.unsubscribe === "function") {
          state.unsubscribe();
        }
        state.unsubscribe = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Conflict check handlers
      .addCase(checkBookingConflict.pending, (state) => {
        state.loading = true;
        state.conflictCheck = null;
      })
      .addCase(checkBookingConflict.fulfilled, (state, action) => {
        state.loading = false;
        state.conflictCheck = action.payload;
      })
      .addCase(checkBookingConflict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Subscribe handlers
      .addCase(subscribeToAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(subscribeToStudentBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToStudentBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToStudentBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(subscribeToTeacherBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToTeacherBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToTeacherBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking handlers
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم إنشاء الحجز بنجاح";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update booking handlers
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم تحديث الحجز بنجاح";
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete booking handlers
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم حذف الحجز بنجاح";
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setBookings, setError, setUnsubscribe, cleanup } =
  bookingSlice.actions;
export default bookingSlice.reducer;
