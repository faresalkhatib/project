// src/forms/BookingForm.js (Updated)
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown, Message, Icon } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import ClassroomCalendar from "../components/ClassroomCalendar";

const BookingForm = ({
  onSubmit,
  loading,
  classrooms,
  teacherInfo,
  enrolledSubjects = [],
  error,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarSelection, setCalendarSelection] = useState(null);

  const validationSchema = Yup.object({
    classroomId: Yup.string().required("القاعة مطلوبة"),
    subjectId: Yup.string().required("يجب اختيار مادة"),
    date: Yup.date()
      .required("التاريخ مطلوب")
      .min(new Date(), "التاريخ يجب أن يكون في المستقبل"),
    startTime: Yup.string()
      .required("وقت البداية مطلوب")
      .test(
        "is-valid-time",
        "يجب أن يكون وقت البداية بين 08:00 و 18:00",
        function (value) {
          if (!value) return false;
          const [hours] = value.split(":").map(Number);
          return hours >= 8 && hours < 18;
        }
      ),
    endTime: Yup.string()
      .required("وقت النهاية مطلوب")
      .test(
        "is-valid-time",
        "يجب أن يكون وقت النهاية بين 08:00 و 18:00",
        function (value) {
          if (!value) return false;
          const [hours] = value.split(":").map(Number);
          return hours >= 8 && hours <= 18;
        }
      )
      .test(
        "is-greater",
        "وقت النهاية يجب أن يكون بعد وقت البداية",
        function (value) {
          const { startTime } = this.parent;
          return !startTime || !value || value > startTime;
        }
      ),
  });

  const subjectOptions = enrolledSubjects.map((subject, index) => ({
    key: `${subject.subjectNumber}-${subject.subjectSubNumber || index}`,
    text: `${subject.subjectNumber} - ${subject.subjectName}${
      subject.subjectSubNumber ? ` (شعبة ${subject.subjectSubNumber})` : ""
    }`,
    value: JSON.stringify(subject),
  }));

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
        classroomId: calendarSelection?.classroomId || "",
        subjectId: "",
        date: calendarSelection?.date || "",
        startTime: calendarSelection?.startTime || "",
        endTime: calendarSelection?.endTime || "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        const selectedSubject = JSON.parse(values.subjectId);
        const selectedClassroom = classrooms.find(
          (c) => c.id === values.classroomId
        );

        const bookingData = {
          classroomId: values.classroomId,
          classroomName: selectedClassroom?.name || "",
          classroom: selectedClassroom?.name || "",
          subjectNumber: selectedSubject.subjectNumber,
          subjectName: selectedSubject.subjectName,
          subjectSubNumber: selectedSubject.subjectSubNumber || "",
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          teacherId: teacherInfo.uid,
          teacherName: teacherInfo.name,
        };

        onSubmit(bookingData);
        resetForm();
        setCalendarSelection(null);
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
      }) => {
        // Handle calendar time slot selection
        const handleTimeSlotSelect = (selection) => {
          setFieldValue("classroomId", selection.classroomId);
          setFieldValue("date", selection.date);
          setFieldValue("startTime", selection.startTime);
          setFieldValue("endTime", selection.endTime);
          setCalendarSelection(selection);
          setShowCalendar(false);
        };

        return (
          <Form onSubmit={handleSubmit}>
            {/* Calendar View Toggle */}
            <div
              style={{
                marginBottom: SPACING.lg,
                padding: SPACING.md,
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                border: "2px solid #2196f3",
              }}
            >
              <Button
                type="button"
                fluid
                style={{
                  backgroundColor: showCalendar ? "#6c757d" : "#2196f3",
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Icon
                  name={showCalendar ? "list" : "calendar alternate outline"}
                />
                {showCalendar
                  ? "إخفاء التقويم"
                  : "عرض التقويم - اختر الوقت من التقويم"}
              </Button>
            </div>

            {/* Calendar Component */}
            {showCalendar && (
              <div style={{ marginBottom: SPACING.lg }}>
                <ClassroomCalendar
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedClassroom={values.classroomId}
                />
              </div>
            )}

            {/* Selected Time Info */}
            {calendarSelection && (
              <Message
                positive
                style={{ direction: "rtl", marginBottom: SPACING.md }}
              >
                <Icon name="check circle" />
                <strong>تم الاختيار من التقويم:</strong>
                <div style={{ marginTop: SPACING.xs }}>
                  التاريخ: {calendarSelection.date} | الوقت:{" "}
                  {calendarSelection.startTime} - {calendarSelection.endTime}
                </div>
              </Message>
            )}

            {/* Subject Selection */}
            <Form.Field error={touched.subjectId && !!errors.subjectId}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                المادة <span style={{ color: COLORS.error }}>*</span>
              </label>
              <Dropdown
                placeholder="اختر المادة"
                fluid
                search
                selection
                options={subjectOptions}
                value={values.subjectId}
                onChange={(e, { value }) => setFieldValue("subjectId", value)}
                style={inputStyle}
                disabled={subjectOptions.length === 0}
              />
              {touched.subjectId && errors.subjectId && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: "right",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.subjectId}
                </div>
              )}
            </Form.Field>

            {/* Classroom Selection */}
            <Form.Field error={touched.classroomId && !!errors.classroomId}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                القاعة <span style={{ color: COLORS.error }}>*</span>
              </label>
              <Dropdown
                placeholder="اختر القاعة أو استخدم التقويم"
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

            {/* Date Selection */}
            <Form.Field error={touched.date && !!errors.date}>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                التاريخ <span style={{ color: COLORS.error }}>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
                min={new Date().toISOString().split("T")[0]}
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

            {/* Time Selection */}
            <Form.Group widths="equal">
              <Form.Field error={touched.startTime && !!errors.startTime}>
                <label
                  style={{ textAlign: "right", color: COLORS.textPrimary }}
                >
                  وقت البداية <span style={{ color: COLORS.error }}>*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={values.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={inputStyle}
                  min="08:00"
                  max="17:59"
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
                <label
                  style={{ textAlign: "right", color: COLORS.textPrimary }}
                >
                  وقت النهاية <span style={{ color: COLORS.error }}>*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={values.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={inputStyle}
                  min="08:00"
                  max="18:00"
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
              disabled={
                loading ||
                classrooms.length === 0 ||
                enrolledSubjects.length === 0
              }
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

            {enrolledSubjects.length === 0 && (
              <div
                style={{
                  color: COLORS.warning,
                  textAlign: "center",
                  marginTop: SPACING.sm,
                  padding: SPACING.sm,
                  backgroundColor: "#fff8e1",
                  borderRadius: "4px",
                }}
              >
                يجب إضافة المواد المسجلة أولاً من القسم أعلاه
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default BookingForm;
