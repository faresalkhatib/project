// src/forms/EnhancedBookingForm.js
import React, { useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Dropdown, Message } from "semantic-ui-react";
import { useLanguage } from "../i18n/LanguageContext";
import { COLORS, SPACING } from "../utils/designConstants";
import {
  validateCollegeHours,
  COLLEGE_HOURS,
  isTeacherEnrolledInSubject,
} from "../utils/bookingValidation";

const EnhancedBookingForm = ({
  onSubmit,
  loading,
  classrooms,
  teacherInfo,
  error,
}) => {
  const { t, direction } = useLanguage();

  // Get teacher's enrolled subjects
  const enrolledSubjects = teacherInfo?.enrolledSubjects || [];

  // Create subject options from enrolled subjects
  const subjectOptions = useMemo(() => {
    return enrolledSubjects.map((subject) => ({
      key: `${subject.subjectNumber}-${subject.subjectSubNumber}`,
      text: `${subject.subjectName} (${subject.subjectNumber}) - ${t(
        "section"
      )} ${subject.subjectSubNumber}`,
      value: JSON.stringify({
        subjectNumber: subject.subjectNumber,
        subjectName: subject.subjectName,
        subjectSubNumber: subject.subjectSubNumber,
      }),
    }));
  }, [enrolledSubjects, t]);

  const validationSchema = Yup.object({
    classroomId: Yup.string().required(t("classroomRequired")),
    subjectData: Yup.string().required(t("subjectRequired")),
    date: Yup.date()
      .required(t("required"))
      .min(new Date(), t("dateMustBeFuture")),
    startTime: Yup.string()
      .required(t("required"))
      .test("college-hours", t("outsideCollegeHours"), function (value) {
        if (!value) return false;
        const [hours] = value.split(":").map(Number);
        return hours >= COLLEGE_HOURS.START && hours < COLLEGE_HOURS.END;
      }),
    endTime: Yup.string()
      .required(t("required"))
      .test("after-start", t("endTimeAfterStart"), function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return false;
        return value > startTime;
      })
      .test("college-hours", t("outsideCollegeHours"), function (value) {
        if (!value) return false;
        const [hours] = value.split(":").map(Number);
        return hours > COLLEGE_HOURS.START && hours <= COLLEGE_HOURS.END;
      }),
  });

  const classroomOptions = classrooms.map((classroom) => ({
    key: classroom.id,
    text: `${classroom.name} - ${classroom.building} (${t("capacity")}: ${
      classroom.capacity
    })`,
    value: classroom.id,
  }));

  const inputStyle = {
    direction: direction,
    textAlign: direction === "rtl" ? "right" : "left",
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
        subjectData: "",
        date: "",
        startTime: "",
        endTime: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Parse subject data
        const subjectInfo = JSON.parse(values.subjectData);

        // Find selected classroom details
        const selectedClassroom = classrooms.find(
          (c) => c.id === values.classroomId
        );

        // Validate college hours
        const hoursValidation = validateCollegeHours(
          values.startTime,
          values.endTime
        );
        if (!hoursValidation.isValid) {
          alert(hoursValidation.message);
          return;
        }

        const bookingData = {
          classroomId: values.classroomId,
          classroomName: selectedClassroom?.name || "",
          classroom: selectedClassroom?.name || "",
          subjectNumber: subjectInfo.subjectNumber,
          subjectName: subjectInfo.subjectName,
          subjectSubNumber: subjectInfo.subjectSubNumber,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
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
          {/* Show warning if teacher has no enrolled subjects */}
          {enrolledSubjects.length === 0 && (
            <Message warning>
              <Message.Header>
                {direction === "rtl"
                  ? "لا توجد مواد مسجلة"
                  : "No Enrolled Subjects"}
              </Message.Header>
              <p>
                {direction === "rtl"
                  ? "يجب عليك تسجيل المواد التي تدرسها أولاً قبل إنشاء حجز."
                  : "You must enroll in subjects you teach before creating bookings."}
              </p>
            </Message>
          )}

          {/* Subject Dropdown */}
          <Form.Field error={touched.subjectData && !!errors.subjectData}>
            <label
              style={{
                textAlign: direction === "rtl" ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("subject")} *
            </label>
            <Dropdown
              placeholder={t("subject")}
              fluid
              search
              selection
              options={subjectOptions}
              value={values.subjectData}
              onChange={(e, { value }) => setFieldValue("subjectData", value)}
              disabled={subjectOptions.length === 0}
              style={inputStyle}
            />
            {touched.subjectData && errors.subjectData && (
              <div
                style={{
                  color: COLORS.error,
                  textAlign: direction === "rtl" ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.subjectData}
              </div>
            )}
          </Form.Field>

          {/* Classroom Dropdown */}
          <Form.Field error={touched.classroomId && !!errors.classroomId}>
            <label
              style={{
                textAlign: direction === "rtl" ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("classroom")} *
            </label>
            <Dropdown
              placeholder={t("selectClassroom")}
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
                  textAlign: direction === "rtl" ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.classroomId}
              </div>
            )}
          </Form.Field>

          {/* Date Field */}
          <Form.Field error={touched.date && !!errors.date}>
            <label
              style={{
                textAlign: direction === "rtl" ? "right" : "left",
                color: COLORS.textPrimary,
              }}
            >
              {t("date")} *
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
                  textAlign: direction === "rtl" ? "right" : "left",
                  marginTop: SPACING.xs,
                }}
              >
                {errors.date}
              </div>
            )}
          </Form.Field>

          {/* College Hours Info */}
          <Message
            info
            style={{ textAlign: direction === "rtl" ? "right" : "left" }}
          >
            {t("collegeHours")}
          </Message>

          {/* Time Fields */}
          <Form.Group widths="equal">
            <Form.Field error={touched.startTime && !!errors.startTime}>
              <label
                style={{
                  textAlign: direction === "rtl" ? "right" : "left",
                  color: COLORS.textPrimary,
                }}
              >
                {t("startTime")} *
              </label>
              <input
                type="time"
                name="startTime"
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min="08:00"
                max="18:00"
                style={inputStyle}
              />
              {touched.startTime && errors.startTime && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: direction === "rtl" ? "right" : "left",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.startTime}
                </div>
              )}
            </Form.Field>

            <Form.Field error={touched.endTime && !!errors.endTime}>
              <label
                style={{
                  textAlign: direction === "rtl" ? "right" : "left",
                  color: COLORS.textPrimary,
                }}
              >
                {t("endTime")} *
              </label>
              <input
                type="time"
                name="endTime"
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min="08:00"
                max="18:00"
                style={inputStyle}
              />
              {touched.endTime && errors.endTime && (
                <div
                  style={{
                    color: COLORS.error,
                    textAlign: direction === "rtl" ? "right" : "left",
                    marginTop: SPACING.xs,
                  }}
                >
                  {errors.endTime}
                </div>
              )}
            </Form.Field>
          </Form.Group>

          {/* Submit Button */}
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
            {t("createBooking")}
          </Button>

          {/* Error Message */}
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

          {/* No Classrooms Warning */}
          {classrooms.length === 0 && (
            <div
              style={{
                color: COLORS.warning,
                textAlign: "center",
                marginTop: SPACING.sm,
              }}
            >
              {t("noClassroomsAvailable")}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default EnhancedBookingForm;
