// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthState } from "./redux/userSlice";
import { subscribeToClassrooms } from "./redux/classroomSlice";
import { Loader, Dimmer } from "semantic-ui-react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";

function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuthState());
    // Subscribe to classrooms globally (needed for maintenance complaint form)
    dispatch(subscribeToClassrooms());
  }, [dispatch]);

  if (!initialized) {
    return (
      <Dimmer active inverted>
        <Loader size="large">جاري التحقق من الجلسة...</Loader>
      </Dimmer>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/maintenance" element={<MaintenanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
