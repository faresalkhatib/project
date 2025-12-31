export const COLLEGE_HOURS = {
  START: 8, // 8:00 AM
  END: 18, // 6:00 PM
};

/**
 * Check if a time string is within college hours (8 AM - 6 PM)
 * @param {string} time - Time in format "HH:MM"
 * @returns {boolean}
 */
export const isWithinCollegeHours = (time) => {
  if (!time) return false;

  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;
  const startInMinutes = COLLEGE_HOURS.START * 60;
  const endInMinutes = COLLEGE_HOURS.END * 60;

  return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
};

/**
 * Check if both start and end times are within college hours
 * @param {string} startTime - Start time in format "HH:MM"
 * @param {string} endTime - End time in format "HH:MM"
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validateCollegeHours = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return { isValid: false, message: "Start time and end time are required" };
  }

  if (!isWithinCollegeHours(startTime)) {
    return {
      isValid: false,
      message: `Start time must be between ${COLLEGE_HOURS.START}:00 and ${COLLEGE_HOURS.END}:00`,
    };
  }

  if (!isWithinCollegeHours(endTime)) {
    return {
      isValid: false,
      message: `End time must be between ${COLLEGE_HOURS.START}:00 and ${COLLEGE_HOURS.END}:00`,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Check if two time ranges overlap
 * @param {string} start1 - First range start time "HH:MM"
 * @param {string} end1 - First range end time "HH:MM"
 * @param {string} start2 - Second range start time "HH:MM"
 * @param {string} end2 - Second range end time "HH:MM"
 * @returns {boolean}
 */
export const timesOverlap = (start1, end1, start2, end2) => {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  return s1 < e2 && e1 > s2;
};

/**
 * Get busy periods for a classroom on a specific date
 * @param {Array} bookings - All bookings
 * @param {string} classroomId - Classroom ID
 * @param {string} date - Date in format "YYYY-MM-DD"
 * @returns {Array} - Array of busy periods [{startTime, endTime, subject, teacher}]
 */
export const getClassroomBusyPeriods = (bookings, classroomId, date) => {
  if (!bookings || !classroomId || !date) return [];

  return bookings
    .filter(
      (booking) =>
        booking.classroomId === classroomId &&
        booking.date === date &&
        (booking.status === "approved" || booking.status === "pending")
    )
    .map((booking) => ({
      startTime: booking.startTime,
      endTime: booking.endTime,
      subject: booking.subjectName,
      teacher: booking.teacherName,
      status: booking.status,
    }))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

/**
 * Check if a classroom is available for a specific time slot
 * @param {Array} bookings - All bookings
 * @param {string} classroomId - Classroom ID
 * @param {string} date - Date in format "YYYY-MM-DD"
 * @param {string} startTime - Start time "HH:MM"
 * @param {string} endTime - End time "HH:MM"
 * @param {string} excludeBookingId - Booking ID to exclude (for updates)
 * @returns {object} - {isAvailable: boolean, conflictingBooking: object|null}
 */
export const checkClassroomAvailability = (
  bookings,
  classroomId,
  date,
  startTime,
  endTime,
  excludeBookingId = null
) => {
  const busyPeriods = bookings.filter(
    (booking) =>
      booking.classroomId === classroomId &&
      booking.date === date &&
      (booking.status === "approved" || booking.status === "pending") &&
      booking.id !== excludeBookingId
  );

  for (const booking of busyPeriods) {
    if (timesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return {
        isAvailable: false,
        conflictingBooking: booking,
      };
    }
  }

  return { isAvailable: true, conflictingBooking: null };
};

/**
 * Get classroom status for a specific time
 * @param {Array} bookings - All bookings for the classroom
 * @param {string} date - Date in format "YYYY-MM-DD"
 * @param {string} currentTime - Current time "HH:MM" (optional, defaults to now)
 * @returns {string} - 'available' | 'busy' | 'fullyBooked'
 */
export const getClassroomStatus = (bookings, date, currentTime = null) => {
  if (!bookings || bookings.length === 0) return "available";

  const today = new Date().toISOString().split("T")[0];
  if (date !== today) {
    // For future dates, check if there are any bookings
    return bookings.length > 0 ? "busy" : "available";
  }

  // For today, check current time
  const now = currentTime || new Date().toTimeString().slice(0, 5);

  // Check if currently in a booking
  const currentBooking = bookings.find(
    (booking) =>
      booking.startTime <= now &&
      booking.endTime > now &&
      (booking.status === "approved" || booking.status === "pending")
  );

  if (currentBooking) return "busy";

  // Check how many hours are booked
  const totalBookedMinutes = bookings.reduce((total, booking) => {
    const [startH, startM] = booking.startTime.split(":").map(Number);
    const [endH, endM] = booking.endTime.split(":").map(Number);
    const duration = endH * 60 + endM - (startH * 60 + startM);
    return total + duration;
  }, 0);

  const collegeMinutes = (COLLEGE_HOURS.END - COLLEGE_HOURS.START) * 60;

  // If more than 80% booked, consider it fully booked
  if (totalBookedMinutes > collegeMinutes * 0.8) return "fullyBooked";

  // If has bookings but not fully booked
  if (bookings.length > 0) return "busy";

  return "available";
};

/**
 * Generate available time slots for a classroom on a specific date
 * @param {Array} bookings - All bookings
 * @param {string} classroomId - Classroom ID
 * @param {string} date - Date in format "YYYY-MM-DD"
 * @param {number} slotDuration - Duration in minutes (default 60)
 * @returns {Array} - Array of available slots [{start, end, available}]
 */
export const generateTimeSlots = (
  bookings,
  classroomId,
  date,
  slotDuration = 60
) => {
  const slots = [];
  const busyPeriods = getClassroomBusyPeriods(bookings, classroomId, date);

  for (let hour = COLLEGE_HOURS.START; hour < COLLEGE_HOURS.END; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endHour = hour + Math.floor(slotDuration / 60);
    const endTime = `${String(endHour).padStart(2, "0")}:00`;

    if (endHour > COLLEGE_HOURS.END) continue;

    const isBusy = busyPeriods.some((period) =>
      timesOverlap(startTime, endTime, period.startTime, period.endTime)
    );

    slots.push({
      start: startTime,
      end: endTime,
      available: !isBusy,
      busyPeriod: isBusy
        ? busyPeriods.find((p) =>
            timesOverlap(startTime, endTime, p.startTime, p.endTime)
          )
        : null,
    });
  }

  return slots;
};

/**
 * Check if teacher is enrolled in the subject
 * @param {Array} enrolledSubjects - Teacher's enrolled subjects
 * @param {string} subjectNumber - Subject number
 * @param {string} subjectSubNumber - Section number
 * @returns {boolean}
 */
export const isTeacherEnrolledInSubject = (
  enrolledSubjects,
  subjectNumber,
  subjectSubNumber
) => {
  if (!enrolledSubjects || !Array.isArray(enrolledSubjects)) return false;

  return enrolledSubjects.some(
    (subject) =>
      subject.subjectNumber === subjectNumber &&
      subject.subjectSubNumber === subjectSubNumber
  );
};

/**
 * Format time for display
 * @param {string} time - Time in "HH:MM" format
 * @param {boolean} use24Hour - Use 24-hour format (default true)
 * @returns {string}
 */
export const formatTime = (time, use24Hour = true) => {
  if (!time) return "";

  if (use24Hour) return time;

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
};
