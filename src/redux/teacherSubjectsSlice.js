// src/redux/teacherSubjectsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../api/firebase";

/* ===================== GET TEACHER SUBJECTS ===================== */
export const getTeacherSubjects = createAsyncThunk(
  "teacherSubjects/getTeacherSubjects",
  async (teacherId, { rejectWithValue }) => {
    try {
      const teacherRef = doc(db, "users", teacherId);
      const teacherDoc = await getDoc(teacherRef);

      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        return data.enrolledSubjects || [];
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== UPDATE TEACHER SUBJECTS ===================== */
export const updateTeacherSubjects = createAsyncThunk(
  "teacherSubjects/updateTeacherSubjects",
  async ({ teacherId, enrolledSubjects }, { rejectWithValue }) => {
    try {
      const teacherRef = doc(db, "users", teacherId);
      await updateDoc(teacherRef, {
        enrolledSubjects,
        updatedAt: Timestamp.now(),
      });

      return enrolledSubjects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== ADD SUBJECT TO TEACHER ===================== */
export const addSubjectToTeacher = createAsyncThunk(
  "teacherSubjects/addSubjectToTeacher",
  async ({ teacherId, subject }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentSubjects = state.teacherSubjects.subjects || [];

      // Check for duplicates
      const isDuplicate = currentSubjects.some(
        (s) =>
          s.subjectNumber === subject.subjectNumber &&
          s.subjectSubNumber === subject.subjectSubNumber
      );

      if (isDuplicate) {
        return rejectWithValue("هذه المادة مضافة بالفعل");
      }

      const updatedSubjects = [...currentSubjects, subject];

      const teacherRef = doc(db, "users", teacherId);
      await updateDoc(teacherRef, {
        enrolledSubjects: updatedSubjects,
        updatedAt: Timestamp.now(),
      });

      return updatedSubjects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== REMOVE SUBJECT FROM TEACHER ===================== */
export const removeSubjectFromTeacher = createAsyncThunk(
  "teacherSubjects/removeSubjectFromTeacher",
  async (
    { teacherId, subjectNumber, subjectSubNumber },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const currentSubjects = state.teacherSubjects.subjects || [];

      const updatedSubjects = currentSubjects.filter(
        (s) =>
          !(
            s.subjectNumber === subjectNumber &&
            s.subjectSubNumber === subjectSubNumber
          )
      );

      const teacherRef = doc(db, "users", teacherId);
      await updateDoc(teacherRef, {
        enrolledSubjects: updatedSubjects,
        updatedAt: Timestamp.now(),
      });

      return updatedSubjects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===================== SLICE ===================== */
const initialState = {
  subjects: [],
  loading: false,
  error: null,
  successMessage: null,
};

const teacherSubjectsSlice = createSlice({
  name: "teacherSubjects",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get teacher subjects
      .addCase(getTeacherSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getTeacherSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update teacher subjects
      .addCase(updateTeacherSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        state.successMessage = "تم تحديث المواد بنجاح";
      })
      .addCase(updateTeacherSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add subject
      .addCase(addSubjectToTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubjectToTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        state.successMessage = "تم إضافة المادة بنجاح";
      })
      .addCase(addSubjectToTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove subject
      .addCase(removeSubjectFromTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSubjectFromTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        state.successMessage = "تم حذف المادة بنجاح";
      })
      .addCase(removeSubjectFromTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setSubjects } = teacherSubjectsSlice.actions;
export default teacherSubjectsSlice.reducer;
