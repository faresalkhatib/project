// src/forms/BookingForm.js
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const BookingForm = ({ onSubmit, loading, classrooms, teacherInfo, error }) => {
  const validationSchema = Yup.object({
    classroomId: Yup.string().required("القاعة مطلوبة"),
    subjectNumber: Yup.string().required("رقم المادة مطلوب"),
    subjectName: Yup.string().required("اسم المادة مطلوب"),
    date: Yup.date()
      .required("التاريخ مطلوب")
      .min(new Date(), "التاريخ يجب أن يكون في المستقبل"),
    startTime: Yup.string().required("وقت البداية مطلوب"),
    endTime: Yup.string()
      .required("وقت النهاية مطلوب")
      .test(
        "is-greater",
        "وقت النهاية يجب أن يكون بعد وقت البداية",
        function (value) {
          const { startTime } = this.parent;
          return !startTime || !value || value > startTime;
        }
      ),
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
        subjectSubNumber: "",
        subjectName: "",
        date: "",
        startTime: "",
        endTime: "",
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
          classroom: selectedClassroom?.name || "",
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

          <Form.Field
            error={touched.subjectSubNumber && !!errors.subjectSubNumber}
          >
            <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
              الشعبة
            </label>
            <input
              type="number"
              name="subjectSubNumber"
              placeholder="مثال: شعبة 1"
              value={values.subjectSubNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
            />
            {touched.subjectSubNumber && errors.subjectSubNumber && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: "right",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.subjectSubNumber}
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

          <Form.Group widths="equal">
            <Form.Field error={touched.startTime && !!errors.startTime}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                وقت البداية
              </label>
              <input
                type="time"
                name="startTime"
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.startTime && errors.startTime && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.startTime}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.endTime && !!errors.endTime}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                وقت النهاية
              </label>
              <input
                type="time"
                name="endTime"
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
              />
              {touched.endTime && errors.endTime && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.endTime}
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

          {error && (
            <div
              style={{
                color: COLORS.error,
                textAlign: "center",
                marginTop: SPACING.sm,
                padding: SPACING.sm,
                backgroundColor: "#ffebee",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

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
