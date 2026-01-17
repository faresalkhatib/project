// src/redux/maintenanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../api/firebase";

/* ===================== SUBSCRIBE TO ALL COMPLAINTS (ADMIN/MAINTENANCE) ===================== */
export const subscribeToAllComplaints = createAsyncThunk(
  "maintenance/subscribeToAllComplaints",
  async (_, { dispatch }) => {
    const complaintsRef = collection(db, "maintenance");

    const unsub = onSnapshot(
      complaintsRef,
      (snapshot) => {
        const complaints = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setComplaints(complaints));
      },
      (error) => {
        dispatch(setError(error.message));
      }
    );

    return unsub;
  }
);

/* ===================== SUBSCRIBE TO USER COMPLAINTS ===================== */
export const subscribeToUserComplaints = createAsyncThunk(
  "maintenance/subscribeToUserComplaints",
  async (userId, { dispatch }) => {
    if (!userId) {
      dispatch(setComplaints([]));
      return null;
    }

    const q = query(
      collection(db, "maintenance"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const complaints = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setComplaints(complaints));
      },
      (error) => {
        dispatch(setError(error.message));
      }
    );

    return unsub;
  }
);

/* ===================== CREATE COMPLAINT ===================== */
export const createComplaint = createAsyncThunk(
  "maintenance/createComplaint",
  async (complaintData, { rejectWithValue }) => {
    try {
      const complaintsRef = collection(db, "maintenance");
      const docRef = await addDoc(complaintsRef, {
        ...complaintData,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      return {
        id: docRef.id,
        ...complaintData,
        status: "pending",
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== UPDATE COMPLAINT STATUS ===================== */
export const updateComplaintStatus = createAsyncThunk(
  "maintenance/updateComplaintStatus",
  async ({ complaintId, status, notes }, { rejectWithValue }) => {
    try {
      const complaintRef = doc(db, "maintenance", complaintId);
      await updateDoc(complaintRef, {
        status,
        notes: notes || "",
        updatedAt: Timestamp.now(),
      });

      return { complaintId, status, notes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== DELETE COMPLAINT ===================== */
export const deleteComplaint = createAsyncThunk(
  "maintenance/deleteComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      const complaintRef = doc(db, "maintenance", complaintId);
      await deleteDoc(complaintRef);
      return complaintId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SLICE ===================== */
const initialState = {
  complaints: [],
  loading: false,
  error: null,
  successMessage: null,
  unsubscribe: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    cleanup: (state) => {
      if (state.unsubscribe && typeof state.unsubscribe === "function") {
        state.unsubscribe();
      }
      state.unsubscribe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe to all complaints
      .addCase(subscribeToAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Subscribe to user complaints
      .addCase(subscribeToUserComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToUserComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم إرسال البلاغ بنجاح";
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Complaint Status
      .addCase(updateComplaintStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم تحديث حالة البلاغ بنجاح";
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Complaint
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم حذف البلاغ بنجاح";
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setComplaints, setError, cleanup } =
  maintenanceSlice.actions;
export default maintenanceSlice.reducer;
