// src/forms/BookingForm.js
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const BookingForm = ({ onSubmit, loading, classrooms, teacherInfo }) => {
  const validationSchema = Yup.object({
    classroomId: Yup.string().required("القاعة مطلوبة"),
    subjectNumber: Yup.string().required("رقم المادة مطلوب"),
    subjectName: Yup.string().required("اسم المادة مطلوب"),
    date: Yup.date()
      .required("التاريخ مطلوب")
      .min(new Date(), "التاريخ يجب أن يكون في المستقبل"),
    time: Yup.string().required("الوقت مطلوب"),
  });

  const classroomOptions = classrooms.map((classroom) => ({
    key: classroom.id,
    text: `${classroom.name} - ${classroom.building} (سعة: ${classroom.capacity})`,
    value: classroom.id,
  }));

  const inputStyle = {
    direction: "rtl",
    textAlign: "right",
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    width: "100%",
    marginTop: SPACING.md,
  };

  return (
    <Formik
      initialValues={{
        classroomId: "",
        subjectNumber: "",
        subjectName: "",
        date: "",
        time: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Find selected classroom details
        const selectedClassroom = classrooms.find(
          (c) => c.id === values.classroomId
        );

        const bookingData = {
          ...values,
          classroomName: selectedClassroom?.name || "",
          teacherId: teacherInfo.uid,
          teacherName: teacherInfo.name,
        };

        onSubmit(bookingData);
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
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Field error={touched.subjectNumber && !!errors.subjectNumber}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              رقم المادة
            </label>
            <input
              type="text"
              name="subjectNumber"
              placeholder="مثال: CS101"
              value={values.subjectNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.subjectNumber && errors.subjectNumber && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.subjectNumber}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.subjectName && !!errors.subjectName}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              اسم المادة
            </label>
            <input
              type="text"
              name="subjectName"
              placeholder="مثال: مقدمة في علوم الحاسوب"
              value={values.subjectName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.subjectName && errors.subjectName && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.subjectName}
              </div>
            )}
          </Form.Field>

          <Form.Field error={touched.classroomId && !!errors.classroomId}>
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              القاعة
            </label>
            <Dropdown
              placeholder="اختر القاعة"
              fluid
              search
              selection
              options={classroomOptions}
              value={values.classroomId}
              onChange={(e, { value }) => setFieldValue("classroomId", value)}
              style={inputStyle}
            />
            {touched.classroomId && errors.classroomId && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.classroomId}
              </div>
            )}
          </Form.Field>

          <Form.Group widths="equal">
            <Form.Field error={touched.date && !!errors.date}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                التاريخ
              </label>
              <input
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.date && errors.date && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.date}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.time && !!errors.time}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                الوقت
              </label>
              <input
                type="time"
                name="time"
                value={values.time}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.time && errors.time && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.time}
                </div>
              )}
            </Form.Field>
          </Form.Group>

          <Button
            type="submit"
            loading={loading}
            disabled={loading || classrooms.length === 0}
            style={buttonStyle}
          >
            إنشاء حجز
          </Button>

          {classrooms.length === 0 && (
            <div
              style={{
                color: COLORS.warning,
                textAlign: "center",
                marginTop: SPACING.sm,
              }}
            >
              لا توجد قاعات متاحة. يرجى الاتصال بالإدارة.
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
