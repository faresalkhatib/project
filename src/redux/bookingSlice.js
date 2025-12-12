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
} from "firebase/firestore";
import { db } from "../api/firebase";

// Fetch all bookings (Admin)
export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingsRef);
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch bookings for a specific student (based on registered subjects)
export const fetchStudentBookings = createAsyncThunk(
  "bookings/fetchStudentBookings",
  async (registeredSubjects, { rejectWithValue }) => {
    try {
      if (!registeredSubjects || registeredSubjects.length === 0) {
        return [];
      }

      const bookingsRef = collection(db, "bookings");
      const subjectNumbers = registeredSubjects.map((sub) => sub.subjectNumber);

      // Fetch all bookings and filter by subject numbers
      const snapshot = await getDocs(bookingsRef);
      const bookings = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (booking) =>
            subjectNumbers.includes(booking.subjectNumber) &&
            booking.status === "approved"
        );

      return bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch bookings for a specific teacher
export const fetchTeacherBookings = createAsyncThunk(
  "bookings/fetchTeacherBookings",
  async (teacherId, { rejectWithValue }) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("teacherId", "==", teacherId));
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new booking (Teacher)
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
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
      return rejectWithValue(error.message);
    }
  }
);

// Update booking status (Admin - Approve/Reject)
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
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

// Delete booking (Teacher - delete their own bookings if pending)
export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  successMessage: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Student Bookings
      .addCase(fetchStudentBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchStudentBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Teacher Bookings
      .addCase(fetchTeacherBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchTeacherBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.successMessage = "تم إنشاء الحجز بنجاح";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { bookingId, status } = action.payload;
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (booking) {
          booking.status = status;
        }
        state.successMessage = `تم ${
          status === "approved" ? "الموافقة على" : "رفض"
        } الحجز`;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.successMessage = "تم حذف الحجز بنجاح";
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = bookingSlice.actions;
export default bookingSlice.reducer;
