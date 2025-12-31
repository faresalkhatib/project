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
        return rejectWithValue("Missing required fields");
      }

      const q = query(
        collection(db, "bookings"),
        where("classroom", "==", classroom),
        where("date", "==", date),
        where("status", "in", ["approved", "pending"])
      );

      const snap = await getDocs(q);

      for (const d of snap.docs) {
        const b = d.data();
        const overlap =
          (startTime >= b.startTime && startTime < b.endTime) ||
          (endTime > b.startTime && endTime <= b.endTime) ||
          (startTime <= b.startTime && endTime >= b.endTime);

        if (overlap) {
          return {
            hasConflict: true,
            message: "القاعة محجوزة",
            conflictingBooking: { id: d.id, ...b },
          };
        }
      }

      return { hasConflict: false };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

/* ===================== SUBSCRIBE (ADMIN) ===================== */
export const subscribeToAllBookings = createAsyncThunk(
  "bookings/subscribeToAllBookings",
  async (_, { dispatch }) => {
    const unsub = onSnapshot(collection(db, "bookings"), (snap) => {
      dispatch(setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });
    return unsub;
  }
);

/* ===================== SUBSCRIBE (STUDENT) ===================== */
export const subscribeToStudentBookings = createAsyncThunk(
  "bookings/subscribeToStudentBookings",
  async (registeredSubjects, { dispatch }) => {
    if (!Array.isArray(registeredSubjects) || !registeredSubjects.length) {
      dispatch(setBookings([]));
      return null;
    }

    const map = new Map();
    const unsubs = [];

    for (const s of registeredSubjects) {
      const q = query(
        collection(db, "bookings"),
        where("subjectNumber", "==", s.subjectNumber),
        where("subjectSubNumber", "==", s.subjectSubNumber),
        where("status", "==", "approved")
      );

      const unsub = onSnapshot(q, (snap) => {
        snap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        dispatch(setBookings(Array.from(map.values())));
      });

      unsubs.push(unsub);
    }

    return () => unsubs.forEach((u) => u());
  }
);

/* ===================== SUBSCRIBE (TEACHER) ===================== */
export const subscribeToTeacherBookings = createAsyncThunk(
  "bookings/subscribeToTeacherBookings",
  async (teacherId, { dispatch }) => {
    if (!teacherId) {
      dispatch(setBookings([]));
      return null;
    }

    const q = query(
      collection(db, "bookings"),
      where("teacherId", "==", teacherId)
    );

    const unsub = onSnapshot(q, (snap) => {
      dispatch(setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });

    return unsub;
  }
);

/* ===================== CREATE ===================== */
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const conflict = await dispatch(
        checkBookingConflict({
          classroom: data.classroom,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
        })
      ).unwrap();

      if (conflict.hasConflict) {
        return rejectWithValue("القاعة محجوزة");
      }

      const ref = await addDoc(collection(db, "bookings"), {
        ...data,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      return { id: ref.id, ...data, status: "pending" };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

/* ===================== UPDATE / DELETE ===================== */
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status,
        updatedAt: Timestamp.now(),
      });
      return { bookingId, status };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      return bookingId;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

/* ===================== SLICE ===================== */
const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    successMessage: null,
    unsubscribe: null,
  },
  reducers: {
    setBookings: (s, a) => {
      s.bookings = a.payload;
      s.loading = false;
    },
    setError: (s, a) => {
      s.error = a.payload;
      s.loading = false;
    },
    clearMessages: (s) => {
      s.error = null;
      s.successMessage = null;
    },
    cleanup: (s) => {
      if (s.unsubscribe) s.unsubscribe();
      s.unsubscribe = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(createBooking.pending, (s) => {
      s.loading = true;
    })
      .addCase(createBooking.fulfilled, (s) => {
        s.loading = false;
        s.successMessage = "تم إنشاء الحجز بنجاح";
      })
      .addCase(createBooking.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { setBookings, setError, clearMessages, cleanup } =
  bookingSlice.actions;

/* ===================== SELECTOR ===================== */
export const selectBusySlots = (state, classroomId, date) =>
  state.bookings.bookings.filter(
    (b) =>
      (b.classroomId === classroomId || b.classroom === classroomId) &&
      b.date === date &&
      (b.status === "approved" || b.status === "pending")
  );

export default bookingSlice.reducer;
