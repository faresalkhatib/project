// ClassroomCalendar.js
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Dropdown, Icon, Label } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import "semantic-ui-css/semantic.min.css";

// Default spacing and colors
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const COLORS = { textPrimary: "#333", textSecondary: "#666" };

const ClassroomCalendar = ({ onTimeSlotSelect, selectedClassroom }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { bookings } = useSelector((state) => state.bookings);
  const { classrooms } = useSelector((state) => state.classrooms);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRoom, setSelectedRoom] = useState(selectedClassroom || "");
  const [examDuration, setExamDuration] = useState(2);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  useEffect(() => {
    if (selectedClassroom) setSelectedRoom(selectedClassroom);
  }, [selectedClassroom]);

  const durationOptions = [
    { key: 1, text: t("one_hour"), value: 1 },
    { key: 1.5, text: t("one_half_hour"), value: 1.5 },
    { key: 2, text: t("two_hours"), value: 2 },
  ];

  const generateAllSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 17 && minute === 30) break;
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return slots;
  };

  const calculateEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const isTimeSlotBusy = (time) => {
    if (!selectedRoom || !selectedDate) return false;
    return bookings.some((booking) => {
      const matchesRoom =
        booking.classroomId === selectedRoom ||
        booking.classroom === selectedRoom;
      const matchesDate = booking.date === selectedDate;
      const matchesStatus =
        booking.status === "approved" || booking.status === "pending";
      if (!matchesRoom || !matchesDate || !matchesStatus) return false;
      return time >= booking.startTime && time < booking.endTime;
    });
  };

  const isPeriodCompletelyFree = (startTime, endTime) => {
    if (!selectedRoom || !selectedDate) return false;
    const allSlots = generateAllSlots();
    const startIndex = allSlots.indexOf(startTime);
    const endIndex = allSlots.indexOf(endTime);
    if (startIndex === -1 || endIndex === -1) return false;
    for (let i = startIndex; i < endIndex; i++) {
      if (isTimeSlotBusy(allSlots[i])) return false;
    }
    return true;
  };

  const generateExamPeriods = () => {
    const periods = [];
    const allSlots = generateAllSlots();
    for (let i = 0; i < allSlots.length; i++) {
      const startTime = allSlots[i];
      const endTime = calculateEndTime(startTime, examDuration);
      const [endHour] = endTime.split(":").map(Number);
      if (endHour > 18 || (endHour === 18 && endTime !== "18:00")) continue;
      periods.push({
        start: startTime,
        end: endTime,
        duration: examDuration,
        label: `${startTime} - ${endTime}`,
        isFree: isPeriodCompletelyFree(startTime, endTime),
      });
    }
    return periods;
  };

  const examPeriods = useMemo(
    () => generateExamPeriods(),
    [selectedRoom, selectedDate, examDuration, bookings]
  );
  const freePeriods = examPeriods.filter((p) => p.isFree);
  const busyPeriods = examPeriods.filter((p) => !p.isFree);

  const handlePeriodClick = (period) => {
    if (!selectedRoom || !selectedDate) {
      alert(t("select_all_fields"));
      return;
    }
    if (!period.isFree) return;
    if (onTimeSlotSelect) {
      onTimeSlotSelect({
        classroomId: selectedRoom,
        date: selectedDate,
        startTime: period.start,
        endTime: period.end,
        duration: period.duration,
      });
    }
  };

  const classroomOptions = classrooms.map((room) => ({
    key: room.id,
    text: `${room.name} - ${room.building || ""} (${t("capacity_label")}: ${
      room.capacity || "N/A"
    })`,
    value: room.id,
  }));

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    const locale = isRTL ? "ar-JO" : "en-US";

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString(locale, { weekday: "long" });
      const dateDisplay = date.toLocaleDateString(locale);
      dates.push({
        key: dateStr,
        text: `${dayName} - ${dateDisplay}`,
        value: dateStr,
      });
    }
    return dates;
  };

  const getDurationText = (duration) => {
    if (duration === 1) return t("one_hour_short");
    if (duration === 1.5) return t("one_half_hour_short");
    return t("two_hours_short");
  };

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* Selection Controls */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: SPACING.lg,
          borderRadius: 12,
          marginBottom: SPACING.lg,
          border: "2px solid #e9ecef",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: SPACING.md,
          }}
        >
          {/* Exam Duration */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: SPACING.xs,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              <Icon name="hourglass half" /> {t("exam_duration")}
            </label>
            <Dropdown
              placeholder={t("select_duration")}
              fluid
              selection
              options={durationOptions}
              value={examDuration}
              onChange={(e, { value }) => setExamDuration(value)}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </div>

          {/* Classroom */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: SPACING.xs,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              <Icon name="building" /> {t("classroom")}
            </label>
            <Dropdown
              placeholder={t("select_classroom")}
              fluid
              search
              selection
              options={classroomOptions}
              value={selectedRoom}
              onChange={(e, { value }) => setSelectedRoom(value)}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </div>

          {/* Date */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: SPACING.xs,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              <Icon name="calendar" /> {t("date")}
            </label>
            <Dropdown
              placeholder={t("select_date")}
              fluid
              selection
              options={getDateOptions()}
              value={selectedDate}
              onChange={(e, { value }) => setSelectedDate(value)}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </div>
        </div>
      </div>

      {/* Calendar / Free periods */}
      {!selectedRoom || !selectedDate ? (
        <div
          style={{
            textAlign: "center",
            padding: SPACING.xl,
            backgroundColor: "#f0f7ff",
            borderRadius: 12,
            border: "2px dashed #90c9ff",
          }}
        >
          <Icon
            name="calendar outline"
            style={{ fontSize: "3rem", color: "#5ba3e0" }}
          />
          <p
            style={{
              color: "#4a90d9",
              fontSize: "1.1rem",
              marginTop: SPACING.md,
            }}
          >
            {t("select_all_fields")}
          </p>
        </div>
      ) : freePeriods.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: SPACING.xl,
            backgroundColor: "#ffebee",
            borderRadius: 12,
            border: "2px solid #ef5350",
          }}
        >
          <Icon
            name="times circle"
            style={{ fontSize: "3rem", color: "#e74c3c" }}
          />
          <p
            style={{
              color: "#c62828",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginTop: SPACING.md,
            }}
          >
            {t("no_available_periods")} {getDurationText(examDuration)}
          </p>
          <p
            style={{
              color: "#d32f2f",
              fontSize: "1rem",
              marginTop: SPACING.sm,
            }}
          >
            {t("try_different_duration")}
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: SPACING.lg,
            border: "2px solid #28a745",
            boxShadow: "0 2px 8px rgba(40, 167, 69, 0.2)",
            marginBottom: SPACING.lg,
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: SPACING.lg,
              color: "#28a745",
              fontSize: "1.4rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: SPACING.sm,
            }}
          >
            <Icon name="check circle" /> {t("available_exam_periods")} -{" "}
            {getDurationText(examDuration)} ({freePeriods.length})
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: SPACING.md,
            }}
          >
            {freePeriods.map((period) => {
              const isHovered = hoveredSlot === period.start;
              return (
                <div
                  key={period.start}
                  onClick={() => handlePeriodClick(period)}
                  onMouseEnter={() => setHoveredSlot(period.start)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  style={{
                    padding: SPACING.lg,
                    borderRadius: 12,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: isHovered ? "#66bb6a" : "#d4edda",
                    border: isHovered
                      ? "3px solid #2e7d32"
                      : "3px solid #28a745",
                    transition: "all 0.3s ease",
                    transform: isHovered
                      ? "scale(1.05) translateY(-4px)"
                      : "scale(1)",
                    boxShadow: isHovered
                      ? "0 8px 20px rgba(40, 167, 69, 0.4)"
                      : "0 2px 8px rgba(40, 167, 69, 0.2)",
                  }}
                >
                  <Icon
                    name="calendar check"
                    style={{
                      fontSize: "2rem",
                      color: isHovered ? "white" : "#155724",
                      marginBottom: SPACING.xs,
                    }}
                  />
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.3rem",
                      marginBottom: SPACING.xs,
                      color: isHovered ? "white" : "#155724",
                    }}
                  >
                    {period.label}
                  </div>
                  <Label
                    style={{
                      backgroundColor: isHovered
                        ? "rgba(255,255,255,0.3)"
                        : undefined,
                      color: isHovered ? "white" : undefined,
                      fontWeight: 600,
                    }}
                  >
                    {getDurationText(period.duration)}
                  </Label>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: isHovered ? "rgba(255,255,255,0.95)" : "#155724",
                      fontWeight: 600,
                      marginTop: SPACING.xs,
                    }}
                  >
                    {isHovered ? t("click_to_book") : t("completely_available")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomCalendar;
