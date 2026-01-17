// src/forms/AddSubjectForm.js
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const AddSubjectForm = ({ onSubmit, loading }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const validationSchema = Yup.object({
    subjectNumber: Yup.string().required(t("subject_number_required")),
    subjectName: Yup.string().required(t("subject_name_required")),
  });

  const inputStyle = {
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    marginTop: SPACING.sm,
  };

  return (
    <Formik
      initialValues={{
        subjectNumber: "",
        subjectName: "",
        subjectSubNumber: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
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
          <Form.Group widths="equal">
            <Form.Field error={touched.subjectNumber && !!errors.subjectNumber}>
              <input
                type="text"
                name="subjectNumber"
                placeholder={t("subject_number_placeholder")}
                value={values.subjectNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.subjectNumber && errors.subjectNumber && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: isRTL ? "right" : "left",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.subjectNumber}
                </div>
              )}
            </Form.Field>
            <Form.Field
              error={touched.subjectSubNumber && !!errors.subjectSubNumber}
            >
              <input
                type="number"
                name="subjectSubNumber"
                placeholder={t("sub_group_placeholder")}
                value={values.subjectSubNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.subjectSubNumber && errors.subjectSubNumber && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: isRTL ? "right" : "left",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.subjectName}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.subjectName && !!errors.subjectName}>
              <input
                type="text"
                name="subjectName"
                placeholder={t("subject_name_placeholder")}
                value={values.subjectName}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.subjectName && errors.subjectName && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: isRTL ? "right" : "left",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.subjectName}
                </div>
              )}
            </Form.Field>

            <Form.Field>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                style={buttonStyle}
              >
                {t("add")}
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

export default AddSubjectForm;
