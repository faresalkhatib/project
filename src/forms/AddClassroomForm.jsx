// src/forms/AddClassroomForm.js
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const AddClassroomForm = ({ onSubmit, loading, initialValues = null }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const validationSchema = Yup.object({
    name: Yup.string().required(t("classroom_name_required")),
    capacity: Yup.number()
      .positive(t("capacity_positive"))
      .required(t("capacity_required")),
    building: Yup.string().required(t("building_required")),
  });

  const inputStyle = {
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
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
            <label
              style={{
                textAlign: isRTL ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("classroom_name")}
            </label>
            <input
              type="text"
              name="name"
              placeholder={t("classroom_name_placeholder")}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.name && errors.name && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: isRTL ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.name}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.capacity && !!errors.capacity}>
            <label
              style={{
                textAlign: isRTL ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("capacity")}
            </label>
            <input
              type="number"
              name="capacity"
              placeholder={t("capacity_placeholder")}
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.capacity && errors.capacity && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: isRTL ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.capacity}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.building && !!errors.building}>
            <label
              style={{
                textAlign: isRTL ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("building")}
            </label>
            <input
              type="text"
              name="building"
              placeholder={t("building_placeholder")}
              value={values.building}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.building && errors.building && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: isRTL ? "right" : "left",
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
            {initialValues ? t("update") : t("add_classroom_button")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddClassroomForm;
