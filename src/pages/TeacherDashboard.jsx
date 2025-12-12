// src/pages/TeacherDashboard.js - REPLACE WITH THIS
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Message,
  Loader,
  Button,
  Icon,
  Label,
} from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Table from "../components/Table";
import BookingForm from "../forms/BookingForm";
import ConfirmModal from "../modals/ConfirmModal";
import {
  fetchTeacherBookings,
  createBooking,
  deleteBooking,
  clearMessages,
} from "../redux/bookingSlice";
import { fetchClassrooms } from "../redux/classroomSlice";
import { COLORS, SPACING, SHADOWS } from "../utils/designConstants";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { bookings, loading, error, successMessage } = useSelector(
    (state) => state.bookings
  );
  const { classrooms, loading: classroomsLoading } = useSelector(
    (state) => state.classrooms
  );

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bookingId: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "teacher") {
      navigate("/");
      return;
    }

    dispatch(fetchTeacherBookings(user.uid));
    dispatch(fetchClassrooms());
  }, [dispatch, user, isAuthenticated, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleCreateBooking = (bookingData) => {
    dispatch(createBooking(bookingData));
    setShowBookingForm(false);
  };

  const handleDeleteBooking = (bookingId) => {
    setConfirmModal({ open: true, bookingId });
  };

  const handleConfirmDelete = () => {
    dispatch(deleteBooking(confirmModal.bookingId));
    setConfirmModal({ open: false, bookingId: null });
  };

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  // Table columns
  const columns = [
    { header: "المادة", accessor: "subjectName" },
    { header: "رقم المادة", accessor: "subjectNumber" },
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
    { header: "الوقت", accessor: "time" },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => {
        const statusColors = {
          pending: "yellow",
          approved: "green",
          rejected: "red",
        };
        const statusText = {
          pending: "قيد الانتظار",
          approved: "مقبول",
          rejected: "مرفوض",
        };
        return (
          <Label color={statusColors[row.status]} style={{ direction: "rtl" }}>
            {statusText[row.status]}
          </Label>
        );
      },
    },
  ];

  const actions = (row) => (
    <div style={{ display: "flex", gap: SPACING.xs }}>
      {row.status === "pending" && (
        <Button
          icon="trash"
          size="small"
          negative
          onClick={() => handleDeleteBooking(row.id)}
          title="حذف"
        />
      )}
      {row.status !== "pending" && (
        <span style={{ color: COLORS.textSecondary, fontSize: "12px" }}>
          {row.status === "approved" ? "تمت الموافقة" : "تم الرفض"}
        </span>
      )}
    </div>
  );

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
            {/* Decorative elements */}
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
                مرحباً د. {user?.name} 👨‍🏫
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                إدارة حجوزات قاعات الامتحانات
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            {[
              {
                label: "إجمالي الحجوزات",
                value: stats.total,
                color: COLORS.primaryRed,
                icon: "calendar check",
                gradient: "linear-gradient(135deg, #8B0000, #c41e3a)",
              },
              {
                label: "قيد الانتظار",
                value: stats.pending,
                color: "#f39c12",
                icon: "clock outline",
                gradient: "linear-gradient(135deg, #f39c12, #f9ca24)",
              },
              {
                label: "مقبولة",
                value: stats.approved,
                color: "#27ae60",
                icon: "check circle",
                gradient: "linear-gradient(135deg, #27ae60, #2ecc71)",
              },
              {
                label: "مرفوضة",
                value: stats.rejected,
                color: "#e74c3c",
                icon: "times circle",
                gradient: "linear-gradient(135deg, #e74c3c, #c0392b)",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: stat.gradient,
                  borderRadius: "16px",
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 35px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.15)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <Icon
                    name={stat.icon}
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "2rem",
                      marginBottom: "0.8rem",
                      marginleft: "0.5rem",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      fontWeight: "800",
                      color: COLORS.textWhite,
                      marginBottom: "0.3rem",
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      color: "rgba(255,255,255,0.95)",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <Message
              negative
              style={{
                textAlign: "center",
                borderRadius: "12px",
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                marginBottom: "1.5rem",
              }}
            >
              {error}
            </Message>
          )}

          {successMessage && (
            <Message
              positive
              style={{
                textAlign: "center",
                borderRadius: "12px",
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                marginBottom: "1.5rem",
              }}
            >
              {successMessage}
            </Message>
          )}

          {/* Create Booking Section */}
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
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: showBookingForm ? "clamp(1.5rem, 3vw, 2rem)" : 0,
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
                    name="plus square"
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
                  إنشاء حجز جديد
                </h3>
              </div>
              <Button
                style={{
                  backgroundColor: showBookingForm
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
                onClick={() => setShowBookingForm(!showBookingForm)}
              >
                <Icon
                  style={{ marginRight: "0.5rem", marginLeft: "0.5rem" }}
                  name={showBookingForm ? "minus" : "plus"}
                />
                {showBookingForm ? "إخفاء" : "إضافة حجز "}
              </Button>
            </div>

            {showBookingForm && (
              <div
                style={{
                  padding: "clamp(1rem, 2.5vw, 1.5rem)",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  border: "2px solid #e9ecef",
                }}
              >
                {classroomsLoading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <Loader active inline="centered">
                      جاري تحميل القاعات...
                    </Loader>
                  </div>
                ) : (
                  <BookingForm
                    onSubmit={handleCreateBooking}
                    loading={loading}
                    classrooms={classrooms}
                    teacherInfo={user}
                  />
                )}
              </div>
            )}
          </div>

          {/* Bookings Table Section */}
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
                  name="list"
                  style={{
                    color: COLORS.textWhite,
                    fontSize: "1.8rem",
                    margin: 5,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  حجوزاتي
                </h2>
              </div>
            </div>

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
                  لا توجد حجوزات حالياً. اضغط على "إضافة حجز" للبدء.
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
                <Table columns={columns} data={bookings} actions={actions} />
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, bookingId: null })}
        onConfirm={handleConfirmDelete}
        title="حذف الحجز"
        message='هل أنت متأكد من حذف هذا الحجز؟ يمكنك حذف الحجوزات التي في حالة "قيد الانتظار" فقط.'
        loading={loading}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
