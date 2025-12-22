// src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Message, Loader, Button, Icon } from "semantic-ui-react";
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
  const {
    user,
    isAuthenticated,
    loading: userLoading,
  } = useSelector((state) => state.user);
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      navigate("/");
      return;
    }

    // Subscribe to real-time updates
    if (user?.registeredSubjects) {
      dispatch(subscribeToStudentBookings(user.registeredSubjects));
    }

    // Cleanup on unmount
    return () => {
      dispatch(cleanupBookings());
    };
  }, [
    dispatch,
    user?.registeredSubjects,
    isAuthenticated,
    navigate,
    user?.role,
  ]);

  const handleAddSubject = (newSubject) => {
    const currentSubjects = user?.registeredSubjects || [];

    const exists = currentSubjects.some(
      (sub) =>
        sub.subjectNumber === newSubject.subjectNumber &&
        sub.subjectSubNumber === newSubject.subjectSubNumber
    );

    if (exists) {
      alert("هذه المادة والشعبة مسجلة بالفعل");
      return;
    }

    const updatedSubjects = [...currentSubjects, newSubject];

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
          sub.subjectNumber === subjectNumber &&
          sub.subjectSubNumber === subjectSubNumber
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
    { header: "المادة", accessor: "subjectName" },
    { header: "رقم المادة", accessor: "subjectNumber" },
    { header: "رقم الشعبة", accessor: "subjectSubNumber" },
    { header: "القاعة", accessor: "classroomName" },
    {
      header: "التاريخ",
      accessor: "date",
      render: (row) => {
        if (row.date?.toDate) {
          return row.date.toDate().toLocaleDateString("ar-JO");
        }
        return row.date || "-";
      },
    },
    {
      header: "وقت البداية",
      accessor: "startTime",
      render: (row) => row.startTime || "-",
    },
    {
      header: "وقت النهاية",
      accessor: "endTime",
      render: (row) => row.endTime || "-",
    },
    { header: "الدكتور", accessor: "teacherName" },
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
        direction: "rtl",
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
                right: "-50px",
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
                left: "-80px",
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
                مرحباً {user?.name} 👋
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                جدول امتحاناتك ومتابعة موادك الدراسية
              </p>
            </div>
          </div>

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
                جدول الامتحانات
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
                  جاري التحميل...
                </Loader>
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
                    margin: 0,
                  }}
                >
                  لا توجد امتحانات مجدولة حالياً
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
                  المواد المسجلة
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
                  style={{ marginRight: "0.5rem", marginLeft: "0.5rem" }}
                />
                {showAddSubject ? "إخفاء" : "إضافة مادة   "}
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
                        {subject.subjectNumber} - شعبة{" "}
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
                  لم يتم تسجيل أي مواد بعد. اضغط على "إضافة مادة" للبدء
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
