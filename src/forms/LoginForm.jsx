// src/forms/LoginForm.js - UPDATE
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Divider } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../redux/userSlice";
import { COLORS, SPACING } from "../utils/designConstants";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
  });

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  const inputStyle = {
    direction: "rtl",
    textAlign: "right",
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    width: "100%",
    padding: SPACING.md,
    fontSize: "16px",
    marginTop: SPACING.md,
  };

  const googleButtonStyle = {
    backgroundColor: COLORS.bgLight,
    color: COLORS.textPrimary,
    width: "100%",
    padding: SPACING.md,
    fontSize: "16px",
    border: `2px solid ${COLORS.border}`,
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: SPACING.md,
    color: COLORS.primaryRed,
    cursor: "pointer",
    textDecoration: "underline",
  };

  return (
    <>
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
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@mutah.edu.jo"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.email && errors.email && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.email}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.password && !!errors.password}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                كلمة المرور
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
                    textAlign: "right",
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
              دخول
            </Button>
          </Form>
        )}
      </Formik>

      <Divider
        horizontal
        style={{ margin: `${SPACING.lg} 0`, color: COLORS.textSecondary }}
      >
        أو
      </Divider>

      <div style={linkStyle} onClick={() => navigate("/register")}>
        ليس لديك حساب؟ سجل الآن
      </div>
    </>
  );
};

export default LoginForm;
