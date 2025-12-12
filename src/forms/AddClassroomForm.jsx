// src/forms/AddClassroomForm.js
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const AddClassroomForm = ({ onSubmit, loading, initialValues = null }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("اسم القاعة مطلوب"),
    capacity: Yup.number()
      .positive("السعة يجب أن تكون رقم موجب")
      .required("سعة القاعة مطلوبة"),
    building: Yup.string().required("اسم المبنى مطلوب"),
  });

  const inputStyle = {
    direction: "rtl",
    textAlign: "right",
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    width: "100%",
    marginTop: SPACING.sm,
  };

  return (
    <Formik
      initialValues={initialValues || { name: "", capacity: "", building: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        if (!initialValues) resetForm();
      }}
      enableReinitialize
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
          <Form.Field error={touched.name && !!errors.name}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              اسم القاعة
            </label>
            <input
              type="text"
              name="name"
              placeholder="مثال: قاعة 101"
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

          <Form.Field error={touched.capacity && !!errors.capacity}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              السعة
            </label>
            <input
              type="number"
              name="capacity"
              placeholder="عدد الطلاب"
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.capacity && errors.capacity && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.capacity}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.building && !!errors.building}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              المبنى
            </label>
            <input
              type="text"
              name="building"
              placeholder="مثال: مبنى العلوم"
              value={values.building}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.building && errors.building && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.building}
              </div>
            )}
          </Form.Field>

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            style={buttonStyle}
          >
            {initialValues ? "تحديث" : "إضافة قاعة"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddClassroomForm;
