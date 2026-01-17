// src/forms/RegistrationForm.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown, Message } from "semantic-ui-react";
import { registerUser } from "../redux/userSlice";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const { t, i18n } = useTranslation();
  const [showAdminCode, setShowAdminCode] = useState(false);

  const ADMIN_SECRET_CODE = "MUTAH2024ADMIN";

  const roleOptions = [
    { key: "student", text: t("student"), value: "student" },
    { key: "teacher", text: t("teacher"), value: "teacher" },
    { key: "admin", text: t("admin"), value: "admin" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().min(3, t("name_min")).required(t("name_required")),
    email: Yup.string().email(t("invalid_email")).required(t("email_required")),
    password: Yup.string()
      .min(6, t("password_min"))
      .required(t("password_required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwords_mismatch"))
      .required(t("confirm_password_required")),
    role: Yup.string().required(t("role_required")),
    adminCode: Yup.string().when("role", {
      is: "admin",
      then: (schema) => schema.required(t("admin_code_required")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = (values, { setFieldError }) => {
    if (values.role === "admin" && values.adminCode !== ADMIN_SECRET_CODE) {
      setFieldError("adminCode", t("admin_code_invalid"));
      return;
    }
    const { confirmPassword, adminCode, ...userData } = values;
    dispatch(registerUser(userData));
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
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        adminCode: "",
        registeredSubjects: [],
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
        setFieldValue,
      }) => {
        return (
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Field error={touched.name && !!errors.name}>
              <label
                style={{
                  textAlign: inputStyle.textAlign,
                  color: COLORS.textPrimary,
                }}
              >
                {t("full_name")}
              </label>
              <input
                type="text"
                name="name"
                placeholder={t("full_name_placeholder")}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.name && errors.name && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: inputStyle.textAlign,
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.name}
                </div>
              )}
            </Form.Field>

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

            {/* Confirm Password */}
            <Form.Field
              error={touched.confirmPassword && !!errors.confirmPassword}
            >
              <label
                style={{
                  textAlign: inputStyle.textAlign,
                  color: COLORS.textPrimary,
                }}
              >
                {t("confirm_password")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: inputStyle.textAlign,
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.confirmPassword}
                </div>
              )}
            </Form.Field>

            {/* Role */}
            <Form.Field error={touched.role && !!errors.role}>
              <label
                style={{
                  textAlign: inputStyle.textAlign,
                  color: COLORS.textPrimary,
                }}
              >
                {t("role")}
              </label>
              <Dropdown
                placeholder={t("role_placeholder")}
                fluid
                selection
                options={roleOptions}
                value={values.role}
                onChange={(e, { value }) => {
                  setFieldValue("role", value);
                  setShowAdminCode(value === "admin");
                }}
                style={inputStyle}
              />
              {touched.role && errors.role && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: inputStyle.textAlign,
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.role}
                </div>
              )}
            </Form.Field>

            {/* Admin Code */}
            {showAdminCode && (
              <>
                <Message warning style={{ textAlign: inputStyle.textAlign }}>
                  <Message.Header>{t("admin_warning")}</Message.Header>
                  <p>{t("admin_warning_msg")}</p>
                </Message>
                <Form.Field error={touched.adminCode && !!errors.adminCode}>
                  <label
                    style={{
                      textAlign: inputStyle.textAlign,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {t("admin_code")}
                  </label>
                  <input
                    type="password"
                    name="adminCode"
                    placeholder={t("admin_code_placeholder")}
                    value={values.adminCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                  {touched.adminCode && errors.adminCode && (
                    <div
                      style={{
                        color: COLORS.error,
                        textAlign: inputStyle.textAlign,
                        marginTop: SPACING.xs,
                      }}
                    >
                      {errors.adminCode}
                    </div>
                  )}
                </Form.Field>
              </>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              style={buttonStyle}
            >
              {t("register")}
            </Button>

            <div style={linkStyle} onClick={() => navigate("/login")}>
              {t("already_have_account")}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegistrationForm;
