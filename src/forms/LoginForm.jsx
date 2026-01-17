// src/forms/LoginForm.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Divider } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../redux/userSlice";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const { t, i18n } = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string().email(t("invalid_email")).required(t("email_required")),
    password: Yup.string()
      .min(6, t("password_min"))
      .required(t("password_required")),
  });

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
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
    <Formik
      initialValues={{ email: "", password: "" }}
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
          <Form.Field error={touched.email && !!errors.email}>
            <label
              style={{
                textAlign: i18n.language === "ar" ? "right" : "left",
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
                  textAlign: i18n.language === "ar" ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.email}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.password && !!errors.password}>
            <label
              style={{
                textAlign: i18n.language === "ar" ? "right" : "left",
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
                  textAlign: i18n.language === "ar" ? "right" : "left",
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

          <Divider
            horizontal
            style={{ margin: `${SPACING.lg} 0`, color: COLORS.textSecondary }}
          >
            {t("or")}
          </Divider>

          <div style={linkStyle} onClick={() => navigate("/register")}>
            {t("no_account_register")}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
