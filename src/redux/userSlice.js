// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";

// Async thunk to check authentication state on app load
export const checkAuthState = createAsyncThunk(
  "user/checkAuthState",
  async (_, { rejectWithValue }) => {
    try {
      // Return a promise that resolves when auth state is determined
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            unsubscribe(); // Unsubscribe after first check

            if (user) {
              try {
                // User is signed in, get their data from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  resolve({
                    uid: user.uid,
                    email: user.email,
                    ...userData,
                  });
                } else {
                  // User exists in Auth but not in Firestore
                  reject(new Error("بيانات المستخدم غير موجودة"));
                }
              } catch (error) {
                reject(error);
              }
            } else {
              // No user is signed in
              resolve(null);
            }
          },
          (error) => {
            unsubscribe();
            reject(error);
          }
        );
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("بيانات المستخدم غير موجودة");
      }

      const userData = userDoc.data();

      return {
        uid: user.uid,
        email: user.email,
        ...userData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, password, name, role, registeredSubjects = [] },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        name,
        role,
        registeredSubjects,
        email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      return {
        uid: user.uid,
        email: user.email,
        ...userData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google Sign-In
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const userData = {
          name: user.displayName || "مستخدم",
          role: "student",
          registeredSubjects: [],
          email: user.email,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, userData);

        return {
          uid: user.uid,
          email: user.email,
          ...userData,
        };
      }

      const userData = userDoc.data();
      return {
        uid: user.uid,
        email: user.email,
        ...userData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserSubjects = createAsyncThunk(
  "user/updateUserSubjects",
  async ({ userId, registeredSubjects }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        registeredSubjects,
        updatedAt: new Date().toISOString(),
      });

      return registeredSubjects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with loading true for initial auth check
  error: null,
  initialized: false, // Track if auth state has been checked
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth State
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
        state.initialized = false;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
        state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Subjects
      .addCase(updateUserSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSubjects.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.registeredSubjects = action.payload;
        }
      })
      .addCase(updateUserSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
