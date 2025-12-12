// src/pages/RegisterPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Segment, Message } from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegistrationForm from "../forms/RegistrationForm";
import { clearError } from "../redux/userSlice";
import { COLORS, SPACING, SHADOWS } from "../utils/designConstants";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "student":
          navigate("/student");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const containerStyle = {
    minHeight: "80vh",
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
    direction: "rtl",
  };

  const segmentStyle = {
    padding: SPACING.xxl,
    boxShadow: SHADOWS.large,
    backgroundColor: COLORS.bgLight,
  };

  const titleStyle = {
    textAlign: "center",
    color: COLORS.primaryRed,
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: SPACING.xl,
  };

  return (
    <>
      <Header />
      <Container style={containerStyle}>
        <Grid centered>
          <Grid.Column mobile={16} tablet={10} computer={8}>
            <Segment style={segmentStyle}>
              <h2 style={titleStyle}>إنشاء حساب جديد</h2>

              {error && (
                <Message
                  negative
                  style={{ textAlign: "center", marginBottom: SPACING.md }}
                >
                  {error}
                </Message>
              )}

              <RegistrationForm />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default RegisterPage;
