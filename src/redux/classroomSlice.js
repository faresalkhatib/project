// src/redux/classroomSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../api/firebase";

// Fetch all classrooms
export const fetchClassrooms = createAsyncThunk(
  "classrooms/fetchClassrooms",
  async (_, { rejectWithValue }) => {
    try {
      const classroomsRef = collection(db, "classrooms");
      const snapshot = await getDocs(classroomsRef);
      const classrooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return classrooms;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add new classroom
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

// Update classroom
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

// Delete classroom
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

const initialState = {
  classrooms: [],
  loading: false,
  error: null,
  successMessage: null,
};

const classroomSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classrooms
      .addCase(fetchClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms = action.payload;
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Classroom
      .addCase(addClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClassroom.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms.push(action.payload);
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
      .addCase(updateClassroom.fulfilled, (state, action) => {
        state.loading = false;
        const { classroomId, classroomData } = action.payload;
        const classroom = state.classrooms.find((c) => c.id === classroomId);
        if (classroom) {
          Object.assign(classroom, classroomData);
        }
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
      .addCase(deleteClassroom.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms = state.classrooms.filter(
          (c) => c.id !== action.payload
        );
        state.successMessage = "تم حذف القاعة بنجاح";
      })
      .addCase(deleteClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = classroomSlice.actions;
export default classroomSlice.reducer;
