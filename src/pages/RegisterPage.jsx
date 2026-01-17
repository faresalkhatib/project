// src/pages/RegisterPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Segment, Message } from "semantic-ui-react";
import { clearError } from "../redux/userSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegistrationForm from "../forms/RegistrationForm";
import { COLORS } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { error, isAuthenticated, user } = useSelector((state) => state.user);

  // Helper function to get dashboard route based on role
  const getDashboardRoute = (role) => {
    switch (role) {
      case "student":
        return "/student";
      case "teacher":
        return "/teacher";
      case "admin":
        return "/admin";
      case "maintenance":
        return "/maintenance";
      default:
        return "/";
    }
  };

  // Redirect if already authenticated or after successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Header />
      <Container
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <Segment
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "2.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "12px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: COLORS.primaryRed,
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "700",
            }}
          >
            {t("register")}
          </h2>

          {error && (
            <Message negative style={{ textAlign: "center" }}>
              {error}
            </Message>
          )}

          <RegistrationForm />
        </Segment>
      </Container>
      <Footer />
    </div>
  );
};

export default RegisterPage;
