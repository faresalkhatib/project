// src/redux/classroomSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../api/firebase";

/* ===================== SUBSCRIBE TO CLASSROOMS ===================== */
export const subscribeToClassrooms = createAsyncThunk(
  "classrooms/subscribeToClassrooms",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const classroomsRef = collection(db, "classrooms");

      const unsubscribe = onSnapshot(
        classroomsRef,
        (snapshot) => {
          const classrooms = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch(setClassrooms(classrooms));
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

/* ===================== ADD CLASSROOM ===================== */
export const addClassroom = createAsyncThunk(
  "classrooms/addClassroom",
  async (classroomData, { rejectWithValue }) => {
    try {
      const classroomsRef = collection(db, "classrooms");
      const docRef = await addDoc(classroomsRef, {
        ...classroomData,
        createdAt: Timestamp.now(),
      });

      return {
        id: docRef.id,
        ...classroomData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== UPDATE CLASSROOM ===================== */
export const updateClassroom = createAsyncThunk(
  "classrooms/updateClassroom",
  async ({ classroomId, classroomData }, { rejectWithValue }) => {
    try {
      const classroomRef = doc(db, "classrooms", classroomId);
      await updateDoc(classroomRef, {
        ...classroomData,
        updatedAt: Timestamp.now(),
      });

      return { classroomId, classroomData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== DELETE CLASSROOM ===================== */
export const deleteClassroom = createAsyncThunk(
  "classrooms/deleteClassroom",
  async (classroomId, { rejectWithValue }) => {
    try {
      const classroomRef = doc(db, "classrooms", classroomId);
      await deleteDoc(classroomRef);
      return classroomId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SLICE ===================== */
const initialState = {
  classrooms: [],
  loading: false,
  error: null,
  successMessage: null,
  unsubscribe: null,
};

const classroomSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setClassrooms: (state, action) => {
      state.classrooms = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
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
      // Subscribe to classrooms
      .addCase(subscribeToClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.unsubscribe = action.payload;
      })
      .addCase(subscribeToClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Classroom
      .addCase(addClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClassroom.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم إضافة القاعة بنجاح";
      })
      .addCase(addClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Classroom
      .addCase(updateClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassroom.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم تحديث القاعة بنجاح";
      })
      .addCase(updateClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Classroom
      .addCase(deleteClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClassroom.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "تم حذف القاعة بنجاح";
      })
      .addCase(deleteClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setClassrooms, setError, cleanup } =
  classroomSlice.actions;
export default classroomSlice.reducer;