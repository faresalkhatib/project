// src/forms/RegistrationForm.js - REPLACE WITH THIS
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown, Message } from "semantic-ui-react";
import { registerUser } from "../redux/userSlice";
import { COLORS, SPACING } from "../utils/designConstants";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Secret admin code - change this to whatever you want
  const ADMIN_SECRET_CODE = "MUTAH2024ADMIN";

  const roleOptions = [
    { key: "student", text: "طالب", value: "student" },
    { key: "teacher", text: "مدرس", value: "teacher" },
    { key: "admin", text: "إداري", value: "admin" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .required("الاسم مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "كلمات المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
    role: Yup.string().required("الدور مطلوب"),
    adminCode: Yup.string().when("role", {
      is: "admin",
      then: (schema) => schema.required("رمز الإداري مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = (values, { setFieldError }) => {
    // Verify admin code if role is admin
    if (values.role === "admin") {
      if (values.adminCode !== ADMIN_SECRET_CODE) {
        setFieldError("adminCode", "رمز الإداري غير صحيح");
        return;
      }
    }

    const { confirmPassword, adminCode, ...userData } = values;
    dispatch(registerUser(userData));
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
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Field error={touched.name && !!errors.name}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                placeholder="أدخل اسمك الكامل"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.name && errors.name && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.name}
                </div>
              )}
            </Form.Field>

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

            <Form.Field
              error={touched.confirmPassword && !!errors.confirmPassword}
            >
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                تأكيد كلمة المرور
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
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.confirmPassword}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.role && !!errors.role}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                الدور
              </label>
              <Dropdown
                placeholder="اختر الدور"
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
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.role}
                </div>
              )}
            </Form.Field>

            {/* Admin Secret Code Field */}
            {showAdminCode && (
              <>
                <Message warning style={{ textAlign: "right" }}>
                  <Message.Header>تنبيه</Message.Header>
                  <p>
                    التسجيل كإداري يتطلب رمز خاص. يرجى إدخال رمز الإداري
                    للمتابعة.
                  </p>
                </Message>
                <Form.Field error={touched.adminCode && !!errors.adminCode}>
                  <label
                    style={{ textAlign: "right", color: COLORS.textPrimary }}
                  >
                    رمز الإداري
                  </label>
                  <input
                    type="password"
                    name="adminCode"
                    placeholder="أدخل رمز الإداري"
                    value={values.adminCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                  {touched.adminCode && errors.adminCode && (
                    <div
                      style={{
                        color: COLORS.error,
                        textAlign: "right",
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
              إنشاء حساب
            </Button>
          </Form>
        )}
      </Formik>

      <div style={linkStyle} onClick={() => navigate("/login")}>
        لديك حساب؟ سجل الدخول
      </div>
    </>
  );
};

export default RegistrationForm;
