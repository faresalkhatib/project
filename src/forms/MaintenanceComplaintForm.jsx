// src/forms/MaintenanceComplaintForm.js
import React from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown, TextArea } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const MaintenanceComplaintForm = ({ onSubmit, loading, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { classrooms } = useSelector((state) => state.classrooms);
  const { user } = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    classroomId: Yup.string().required(t("classroom_required")),
    description: Yup.string()
      .min(10, t("description_min"))
      .required(t("description_required")),
  });

  const classroomOptions = classrooms.map((classroom) => ({
    key: classroom.id,
    text: `${classroom.name} - ${classroom.building}`,
    value: classroom.id,
  }));

  const inputStyle = {
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  };

  return (
    <Formik
      initialValues={{
        classroomId: "",
        classroomName: "",
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const selectedClassroom = classrooms.find(
          (c) => c.id === values.classroomId
        );
        onSubmit({
          ...values,
          classroomName: selectedClassroom?.name || "",
          userId: user?.uid,
          userName: user?.name,
          userEmail: user?.email,
        });
      }}
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
          {/* Classroom Selection */}
          <Form.Field error={touched.classroomId && !!errors.classroomId}>
            <label
              style={{
                textAlign: inputStyle.textAlign,
                color: COLORS.textPrimary,
                fontWeight: "600",
              }}
            >
              {t("classroom")} *
            </label>
            <Dropdown
              placeholder={t("select_classroom")}
              fluid
              search
              selection
              options={classroomOptions}
              value={values.classroomId}
              onChange={(e, { value }) => setFieldValue("classroomId", value)}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.classroomId && errors.classroomId && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: inputStyle.textAlign,
                  marginTop: SPACING.xs,
                  fontSize: "0.9rem",
                }}
              >
                {errors.classroomId}
              </div>
            )}
          </Form.Field>

          {/* Description */}
          <Form.Field error={touched.description && !!errors.description}>
            <label
              style={{
                textAlign: inputStyle.textAlign,
                color: COLORS.textPrimary,
                fontWeight: "600",
              }}
            >
              {t("description")} *
            </label>
            <TextArea
              name="description"
              placeholder={t("description_placeholder")}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "100px",
              }}
            />
            {touched.description && errors.description && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: inputStyle.textAlign,
                  marginTop: SPACING.xs,
                  fontSize: "0.9rem",
                }}
              >
                {errors.description}
              </div>
            )}
          </Form.Field>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: SPACING.lg,
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              style={{
                backgroundColor: COLORS.primaryRed,
                color: COLORS.textWhite,
                flex: 1,
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              {t("submit_complaint")}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: "#6c757d",
                color: COLORS.textWhite,
                flex: 1,
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              {t("cancel")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MaintenanceComplaintForm;
