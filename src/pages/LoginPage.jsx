// src/pages/LoginPage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Segment, Message } from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "semantic-ui-react";
import { loginUser, loginWithGoogle, clearError } from "../redux/userSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.user
  );

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

  // Redirect if already authenticated
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

  const validationSchema = Yup.object({
    email: Yup.string().email(t("invalid_email")).required(t("email_required")),
    password: Yup.string().required(t("password_required")),
  });

  const handleSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (!result.error && result.payload) {
      // Navigate to the appropriate dashboard
      navigate(getDashboardRoute(result.payload.role));
    }
  };

  const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle());
    if (!result.error && result.payload) {
      // Navigate to the appropriate dashboard
      navigate(getDashboardRoute(result.payload.role));
    }
  };

  const inputStyle = {
    direction: i18n.language === "ar" ? "rtl" : "ltr",
    textAlign: i18n.language === "ar" ? "right" : "left",
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    width: "100%",
    padding: SPACING.md,
    fontSize: "16px",
    marginTop: SPACING.md,
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: SPACING.md,
    color: COLORS.primaryRed,
    cursor: "pointer",
    textDecoration: "underline",
  };

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
            maxWidth: "500px",
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
            {t("login")}
          </h2>

          {error && (
            <Message negative style={{ textAlign: "center" }}>
              {error}
            </Message>
          )}

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Field error={touched.email && !!errors.email}>
                  <label
                    style={{
                      textAlign: inputStyle.textAlign,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("email_placeholder")}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                  {touched.email && errors.email && (
                    <div
                      style={{
                        color: COLORS.error,
                        textAlign: inputStyle.textAlign,
                        marginTop: SPACING.xs,
                      }}
                    >
                      {errors.email}
                    </div>
                  )}
                </Form.Field>

                {/* Password */}
                <Form.Field error={touched.password && !!errors.password}>
                  <label
                    style={{
                      textAlign: inputStyle.textAlign,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {t("password")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                  {touched.password && errors.password && (
                    <div
                      style={{
                        color: COLORS.error,
                        textAlign: inputStyle.textAlign,
                        marginTop: SPACING.xs,
                      }}
                    >
                      {errors.password}
                    </div>
                  )}
                </Form.Field>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  style={buttonStyle}
                >
                  {t("login")}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Google Login */}
          {/* <Button
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: "#4285f4",
              marginTop: "1rem",
            }}
          >
            {t("login_with_google") || "Login with Google"}
          </Button> */}

          <div style={linkStyle} onClick={() => navigate("/register")}>
            {t("dont_have_account")}
          </div>
        </Segment>
      </Container>
      <Footer />
    </div>
  );
};

export default LoginPage;
