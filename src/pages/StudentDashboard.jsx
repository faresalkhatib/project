// src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Message, Loader, Button, Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Table from "../components/Table";
import AddSubjectForm from "../forms/AddSubjectForm";
import {
  subscribeToStudentBookings,
  cleanup as cleanupBookings,
} from "../redux/bookingSlice";
import { updateUserSubjects } from "../redux/userSlice";
import { COLORS } from "../utils/designConstants";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    user,
    isAuthenticated,
    loading: userLoading,
  } = useSelector((state) => state.user);
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [debugInfo, setDebugInfo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      navigate("/");
      return;
    }

    // NORMALIZE subjects to strings before subscribing
    if (user?.registeredSubjects && user.registeredSubjects.length > 0) {
      const normalizedSubjects = user.registeredSubjects.map((sub) => ({
        ...sub,
        subjectNumber: String(sub.subjectNumber),
        subjectSubNumber: String(sub.subjectSubNumber),
      }));

      console.log(
        "🔔 Subscribing with NORMALIZED subjects:",
        normalizedSubjects
      );
      dispatch(subscribeToStudentBookings(normalizedSubjects));
    } else {
      console.log("⚠️ No registered subjects found");
    }

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up bookings subscription");
      dispatch(cleanupBookings());
    };
  }, [
    dispatch,
    user?.registeredSubjects,
    isAuthenticated,
    navigate,
    user?.role,
  ]);

  // Debug effect
  useEffect(() => {
    console.log("📊 Debug Info:");
    console.log("- User Subjects (RAW):", user?.registeredSubjects);
    console.log(
      "- User Subjects Types:",
      user?.registeredSubjects?.map((s) => ({
        name: s.subjectName,
        number: s.subjectNumber,
        numberType: typeof s.subjectNumber,
        subNumber: s.subjectSubNumber,
        subNumberType: typeof s.subjectSubNumber,
      }))
    );
    console.log("- Bookings Count:", bookings?.length);
    console.log(
      "- Bookings Types:",
      bookings?.map((b) => ({
        name: b.subjectName,
        number: b.subjectNumber,
        numberType: typeof b.subjectNumber,
        subNumber: b.subjectSubNumber,
        subNumberType: typeof b.subjectSubNumber,
      }))
    );
    console.log("- Loading:", loading);
    console.log("- Error:", error);
  }, [user?.registeredSubjects, bookings, loading, error]);

  const handleAddSubject = (newSubject) => {
    const currentSubjects = user?.registeredSubjects || [];

    // Normalize for comparison
    const normalizedNew = {
      ...newSubject,
      subjectNumber: String(newSubject.subjectNumber),
      subjectSubNumber: String(newSubject.subjectSubNumber),
    };

    const exists = currentSubjects.some(
      (sub) =>
        String(sub.subjectNumber) === normalizedNew.subjectNumber &&
        String(sub.subjectSubNumber) === normalizedNew.subjectSubNumber
    );

    if (exists) {
      alert(t("subject_already_registered"));
      return;
    }

    const updatedSubjects = [...currentSubjects, normalizedNew];

    dispatch(
      updateUserSubjects({
        userId: user.uid,
        registeredSubjects: updatedSubjects,
      })
    );
  };

  const handleRemoveSubject = (subjectNumber, subjectSubNumber) => {
    const updatedSubjects = user.registeredSubjects.filter(
      (sub) =>
        !(
          String(sub.subjectNumber) === String(subjectNumber) &&
          String(sub.subjectSubNumber) === String(subjectSubNumber)
        )
    );

    dispatch(
      updateUserSubjects({
        userId: user.uid,
        registeredSubjects: updatedSubjects,
      })
    );
  };

  const columns = [
    { header: t("subject"), accessor: "subjectName" },
    { header: t("subject_number"), accessor: "subjectNumber" },
    { header: t("sub_group_number"), accessor: "subjectSubNumber" },
    { header: t("classroom"), accessor: "classroomName" },
    {
      header: t("date"),
      accessor: "date",
      render: (row) => {
        if (row.date?.toDate) {
          return row.date
            .toDate()
            .toLocaleDateString(isRTL ? "ar-JO" : "en-US");
        }
        return row.date || "-";
      },
    },
    {
      header: t("start_time"),
      accessor: "startTime",
      render: (row) => row.startTime || "-",
    },
    {
      header: t("end_time"),
      accessor: "endTime",
      render: (row) => row.endTime || "-",
    },
    { header: t("teacher"), accessor: "teacherName" },
    {
      header: t("status"),
      accessor: "status",
      render: (row) => {
        const statusColors = {
          approved: "#28a745",
          pending: "#ffc107",
          rejected: "#dc3545",
        };
        return (
          <span
            style={{
              backgroundColor: statusColors[row.status] || "#6c757d",
              color: "white",
              padding: "0.3rem 0.8rem",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            {row.status || "unknown"}
          </span>
        );
      },
    },
  ];

  const tableData = bookings.map((booking) => ({
    ...booking,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        direction: isRTL ? "rtl" : "ltr",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Sticky Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Header />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "clamp(1.5rem, 4vw, 3rem) 0" }}>
        <Container style={{ maxWidth: "1400px", padding: "0 1rem" }}>
          {/* Welcome Section */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.primaryRed} 0%, #c41e3a 100%)`,
              borderRadius: "20px",
              padding: "clamp(2rem, 4vw, 3rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              boxShadow: "0 10px 40px rgba(139, 0, 0, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                [isRTL ? "right" : "left"]: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-80px",
                [isRTL ? "left" : "right"]: "-80px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h1
                style={{
                  color: COLORS.textWhite,
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  marginBottom: "0.5rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                {t("welcome_student", { name: user?.name })} 👋
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                {t("student_dashboard_subtitle")}
              </p>
            </div>
          </div>

          {/* Debug Toggle Button */}
          <Button
            size="mini"
            onClick={() => setDebugInfo(!debugInfo)}
            style={{
              marginBottom: "1rem",
              backgroundColor: "#6c757d",
              color: "white",
            }}
          >
            {debugInfo ? "Hide Debug Info" : "Show Debug Info"}
          </Button>

          {/* Debug Info Panel */}
          {debugInfo && (
            <div
              style={{
                backgroundColor: "#fff3cd",
                border: "2px solid #ffc107",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
            >
              <h4 style={{ marginTop: 0, color: "#856404" }}>
                🔍 TYPE MISMATCH DETECTOR:
              </h4>

              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              >
                <strong>YOUR REGISTERED SUBJECTS:</strong>
                {user?.registeredSubjects?.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginLeft: "1rem",
                      color: "#495057",
                      marginTop: "0.3rem",
                    }}
                  >
                    <div>📚 {sub.subjectName}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                      - Number: "{sub.subjectNumber}" (type:{" "}
                      {typeof sub.subjectNumber})
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                      - SubNumber: "{sub.subjectSubNumber}" (type:{" "}
                      {typeof sub.subjectSubNumber})
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              >
                <strong>BOOKINGS IN DATABASE:</strong>
                {bookings?.length === 0 ? (
                  <div
                    style={{
                      marginLeft: "1rem",
                      color: "#dc3545",
                      marginTop: "0.3rem",
                    }}
                  >
                    ❌ NO BOOKINGS FOUND!
                  </div>
                ) : (
                  bookings?.map((booking, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginLeft: "1rem",
                        color: "#495057",
                        marginTop: "0.3rem",
                      }}
                    >
                      <div>
                        📅 {booking.subjectName} - Status: {booking.status}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                        - Number: "{booking.subjectNumber}" (type:{" "}
                        {typeof booking.subjectNumber})
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                        - SubNumber: "{booking.subjectSubNumber}" (type:{" "}
                        {typeof booking.subjectSubNumber})
                      </div>
                      {user?.registeredSubjects?.some(
                        (s) =>
                          String(s.subjectNumber) ===
                            String(booking.subjectNumber) &&
                          String(s.subjectSubNumber) ===
                            String(booking.subjectSubNumber)
                      ) ? (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#28a745",
                            fontWeight: "bold",
                          }}
                        >
                          ✅ MATCH FOUND!
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#dc3545",
                            fontWeight: "bold",
                          }}
                        >
                          ❌ NO MATCH - Type mismatch or different values
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Exams Schedule Section */}
          <div
            style={{
              backgroundColor: COLORS.bgLight,
              borderRadius: "20px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${COLORS.primaryRed}, #c41e3a)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  name="calendar alternate outline"
                  style={{
                    color: COLORS.textWhite,
                    fontSize: "1.8rem",
                    margin: 0,
                  }}
                />
              </div>
              <h2
                style={{
                  color: COLORS.textPrimary,
                  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  fontWeight: "700",
                  margin: 0,
                  flex: 1,
                }}
              >
                {t("exam_schedule")}
              </h2>
            </div>

            {error && (
              <Message
                negative
                style={{
                  textAlign: "center",
                  borderRadius: "12px",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                }}
              >
                {error}
              </Message>
            )}

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(3rem, 6vw, 5rem)",
                }}
              >
                <Loader active inline="centered" size="large">
                  {t("loading")}
                </Loader>
              </div>
            ) : !user?.registeredSubjects ||
              user.registeredSubjects.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(2rem, 4vw, 3rem)",
                  backgroundColor: "#fff3cd",
                  borderRadius: "12px",
                  border: "2px dashed #ffc107",
                }}
              >
                <Icon
                  name="info circle"
                  style={{
                    fontSize: "4rem",
                    color: "#ff9800",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    color: "#856404",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    fontWeight: "500",
                    margin: 0,
                  }}
                >
                  {t("please_register_subjects_first") ||
                    "Please register subjects first to see your exam schedule"}
                </p>
              </div>
            ) : bookings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(2rem, 4vw, 3rem)",
                  backgroundColor: "#f0f7ff",
                  borderRadius: "12px",
                  border: "2px dashed #90c9ff",
                }}
              >
                <Icon
                  name="inbox"
                  style={{
                    fontSize: "4rem",
                    color: "#5ba3e0",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    color: "#4a90d9",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t("no_exams_scheduled")}
                </p>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    margin: 0,
                  }}
                >
                  {t("exams_will_appear_here") ||
                    "Exams will appear here once they are scheduled and approved"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  margin: "0 -1rem",
                  padding: "0 1rem",
                }}
              >
                <Table columns={columns} data={tableData} />
              </div>
            )}
          </div>

          {/* Registered Subjects Section */}
          <div
            style={{
              backgroundColor: COLORS.bgLight,
              borderRadius: "20px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${COLORS.primaryRed}, #c41e3a)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    name="book"
                    style={{
                      color: COLORS.textWhite,
                      fontSize: "1.8rem",
                      margin: 0,
                    }}
                  />
                </div>
                <h3
                  style={{
                    color: COLORS.textPrimary,
                    margin: 0,
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                    fontWeight: "700",
                  }}
                >
                  {t("registered_subjects")}
                </h3>
              </div>
              <Button
                style={{
                  backgroundColor: showAddSubject
                    ? "#6c757d"
                    : COLORS.primaryRed,
                  color: COLORS.textWhite,
                  borderRadius: "12px",
                  padding: "0.8rem 1.5rem",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                  fontWeight: "600",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(139, 0, 0, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(139, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(139, 0, 0, 0.3)";
                }}
                onClick={() => setShowAddSubject(!showAddSubject)}
              >
                <Icon
                  name={showAddSubject ? "minus" : "plus"}
                  style={{
                    [isRTL ? "marginLeft" : "marginRight"]: "0.5rem",
                    [isRTL ? "marginRight" : "marginLeft"]: "0.5rem",
                  }}
                />
                {showAddSubject ? t("hide_form") : t("add_subject")}
              </Button>
            </div>

            {showAddSubject && (
              <div
                style={{
                  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                  padding: "clamp(1rem, 2.5vw, 1.5rem)",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  border: "2px solid #e9ecef",
                }}
              >
                <AddSubjectForm
                  onSubmit={handleAddSubject}
                  loading={userLoading}
                />
              </div>
            )}

            {user?.registeredSubjects && user.registeredSubjects.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {user.registeredSubjects.map((subject, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "clamp(1rem, 2.5vw, 1.5rem)",
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "2px solid #e9ecef",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS.primaryRed;
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(139, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e9ecef";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: "700",
                          color: COLORS.textPrimary,
                          fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                          marginBottom: "0.3rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {subject.subjectName}
                      </div>
                      <div
                        style={{
                          color: COLORS.textSecondary,
                          fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                        }}
                      >
                        {subject.subjectNumber} - {t("sub_group")}{" "}
                        {subject.subjectSubNumber}
                      </div>
                    </div>
                    <Button
                      icon="trash"
                      size="small"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "8px",
                        padding: "0.6rem",
                        border: "none",
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#c82333";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#dc3545";
                        e.target.style.transform = "scale(1)";
                      }}
                      onClick={() =>
                        handleRemoveSubject(
                          subject.subjectNumber,
                          subject.subjectSubNumber
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(2rem, 4vw, 3rem)",
                  backgroundColor: "#fff3cd",
                  borderRadius: "12px",
                  border: "2px dashed #ffc107",
                }}
              >
                <Icon
                  name="warning sign"
                  style={{
                    fontSize: "4rem",
                    color: "#ff9800",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    color: "#856404",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    fontWeight: "500",
                    margin: 0,
                  }}
                >
                  {t("no_registered_subjects")}
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StudentDashboard;
