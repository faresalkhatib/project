import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Segment,
  Message,
  Loader,
  Button,
  Icon,
  Tab,
  Label,
  Modal,
  Grid,
} from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Table from "../components/Table";
import AddClassroomForm from "../forms/AddClassroomForm";
import ConfirmModal from "../modals/ConfirmModal";
import {
  subscribeToAllBookings,
  updateBookingStatus,
  deleteBooking,
  clearMessages as clearBookingMessages,
  cleanup as cleanupBookings,
} from "../redux/bookingSlice";
import {
  subscribeToClassrooms,
  addClassroom,
  updateClassroom,
  deleteClassroom,
  clearMessages as clearClassroomMessages,
  cleanup as cleanupClassrooms,
} from "../redux/classroomSlice";
import { COLORS, SPACING, SHADOWS } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    successMessage: bookingsSuccess,
  } = useSelector((state) => state.bookings);
  const {
    classrooms,
    loading: classroomsLoading,
    error: classroomsError,
    successMessage: classroomsSuccess,
  } = useSelector((state) => state.classrooms);

  const [showAddClassroom, setShowAddClassroom] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    data: null,
  });
  const [editClassroom, setEditClassroom] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    if (user?.role !== "admin") navigate("/");
    dispatch(subscribeToAllBookings());
    dispatch(subscribeToClassrooms());
    return () => {
      dispatch(cleanupBookings());
      dispatch(cleanupClassrooms());
    };
  }, [dispatch, user, isAuthenticated, navigate]);

  useEffect(() => {
    if (bookingsSuccess || classroomsSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearBookingMessages());
        dispatch(clearClassroomMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingsSuccess, classroomsSuccess, dispatch]);

  const handleConfirm = () => {
    const { type, data } = confirmModal;
    switch (type) {
      case "approve":
        dispatch(updateBookingStatus({ bookingId: data, status: "approved" }));
        break;
      case "reject":
        dispatch(updateBookingStatus({ bookingId: data, status: "rejected" }));
        break;
      case "deleteBooking":
        dispatch(deleteBooking(data));
        break;
      case "deleteClassroom":
        dispatch(deleteClassroom(data));
        break;
      default:
        break;
    }
    setConfirmModal({ open: false, type: "", data: null });
  };

  const toggleShowAddClassroom = () => setShowAddClassroom(!showAddClassroom);

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    totalClassrooms: classrooms.length,
  };

  const getRoleName = (role) => t(`role_${role}`);

  // Stats Card Component
  const StatCard = ({ icon, label, value, color, gradient }) => (
    <div
      style={{
        background:
          gradient || `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
        borderRadius: "16px",
        padding: "clamp(1.5rem, 3vw, 2rem)",
        border: `2px solid ${color}30`,
        boxShadow: `0 4px 20px ${color}20`,
        transition: "all 0.3s ease",
        cursor: "default",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 4px 20px ${color}20`;
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          boxShadow: `0 4px 15px ${color}40`,
        }}
      >
        <Icon
          name={icon}
          style={{
            color: "white",
            fontSize: "1.8rem",
            margin: 0,
          }}
        />
      </div>
      <div
        style={{
          fontSize: "clamp(2rem, 4vw, 2.5rem)",
          fontWeight: "800",
          color: color,
          marginBottom: "0.3rem",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          color: "#6c757d",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
    </div>
  );

  // Bookings columns with translations
  const bookingsColumns = [
    { header: t("subject"), accessor: "subjectName" },
    { header: t("subject_number"), accessor: "subjectNumber" },
    { header: t("sub_group"), accessor: "subjectSubNumber" },
    { header: t("classroom"), accessor: "classroomName" },
    {
      header: t("date"),
      accessor: "date",
      render: (row) =>
        row.date?.toDate?.()?.toLocaleDateString(i18n.language) ||
        row.date ||
        "-",
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
          pending: "yellow",
          approved: "green",
          rejected: "red",
        };
        const statusText = {
          pending: t("pending"),
          approved: t("approved"),
          rejected: t("rejected"),
        };
        return (
          <Label
            color={statusColors[row.status]}
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
          >
            {statusText[row.status]}
          </Label>
        );
      },
    },
  ];

  const bookingsActions = (row) => (
    <div style={{ display: "flex", gap: SPACING.xs, justifyContent: "center" }}>
      {row.status === "pending" && (
        <>
          <Button
            icon="check"
            size="small"
            positive
            onClick={() =>
              setConfirmModal({
                open: true,
                type: "approve",
                data: row.id,
                title: t("approve_booking"),
                message: t("approve_booking_msg"),
              })
            }
            title={t("approve")}
          />
          <Button
            icon="times"
            size="small"
            negative
            onClick={() =>
              setConfirmModal({
                open: true,
                type: "reject",
                data: row.id,
                title: t("reject_booking"),
                message: t("reject_booking_msg"),
              })
            }
            title={t("reject")}
          />
        </>
      )}
      <Button
        icon="trash"
        size="small"
        color="red"
        onClick={() =>
          setConfirmModal({
            open: true,
            type: "deleteBooking",
            data: row.id,
            title: t("delete_booking"),
            message: t("delete_booking_msg"),
          })
        }
        title={t("delete")}
      />
    </div>
  );

  const classroomsColumns = [
    { header: t("classroom"), accessor: "name" },
    { header: t("capacity"), accessor: "capacity" },
    { header: t("building"), accessor: "building" },
  ];

  const classroomsActions = (row) => (
    <div style={{ display: "flex", gap: SPACING.xs, justifyContent: "center" }}>
      <Button
        icon="edit"
        size="small"
        primary
        onClick={() => setEditClassroom(row)}
        title={t("edit_classroom")}
      />
      <Button
        icon="trash"
        size="small"
        negative
        onClick={() =>
          setConfirmModal({
            open: true,
            type: "deleteClassroom",
            data: row.id,
            title: t("delete_classroom"),
            message: t("delete_classroom_msg"),
          })
        }
        title={t("delete")}
      />
    </div>
  );

  // panes for tabs
  const panes = [
    {
      menuItem: {
        key: "bookings",
        icon: "calendar",
        content: `${t("total_bookings")} (${stats.totalBookings})`,
      },
      render: () => (
        <Tab.Pane
          style={{
            border: "none",
            boxShadow: "none",
            padding: SPACING.md,
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {bookingsError && (
            <Message negative style={{ textAlign: "center" }}>
              {bookingsError}
            </Message>
          )}
          {bookingsSuccess && (
            <Message positive style={{ textAlign: "center" }}>
              {bookingsSuccess}
            </Message>
          )}
          {bookingsLoading ? (
            <Loader active inline="centered" size="large">
              {t("loading")}
            </Loader>
          ) : bookings.length === 0 ? (
            <Message info style={{ textAlign: "center" }}>
              <Icon name="inbox" size="huge" />
              <Message.Header>{t("no_bookings")}</Message.Header>
              <p>{t("no_bookings_msg")}</p>
            </Message>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={bookingsColumns}
                data={bookings}
                actions={bookingsActions}
              />
            </div>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "classrooms",
        icon: "building",
        content: `${t("classrooms")} (${stats.totalClassrooms})`,
      },
      render: () => (
        <Tab.Pane
          style={{
            border: "none",
            boxShadow: "none",
            padding: SPACING.md,
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div style={{ marginBottom: SPACING.md }}>
            <Button
              style={{
                backgroundColor: COLORS.primaryRed,
                color: COLORS.textWhite,
              }}
              size="large"
              onClick={toggleShowAddClassroom}
            >
              <Icon
                style={{ marginRight: "0.5rem", marginLeft: "0.5rem" }}
                name={showAddClassroom ? "minus" : "plus"}
              />
              {showAddClassroom ? t("hide_form") : t("add_classroom")}
            </Button>
          </div>
          {showAddClassroom && (
            <Segment style={{ marginBottom: SPACING.md, padding: SPACING.lg }}>
              <h3
                style={{ color: COLORS.primaryRed, marginBottom: SPACING.md }}
              >
                <Icon name="plus circle" />
                {t("add_classroom")}
              </h3>
              <AddClassroomForm
                onSubmit={(data) => {
                  dispatch(addClassroom(data));
                  setShowAddClassroom(false);
                }}
                loading={classroomsLoading}
              />
            </Segment>
          )}
          {classroomsError && (
            <Message negative style={{ textAlign: "center" }}>
              {classroomsError}
            </Message>
          )}
          {classroomsSuccess && (
            <Message positive style={{ textAlign: "center" }}>
              {classroomsSuccess}
            </Message>
          )}
          {classroomsLoading ? (
            <Loader active inline="centered" size="large">
              {t("loading")}
            </Loader>
          ) : classrooms.length === 0 ? (
            <Message info style={{ textAlign: "center" }}>
              <Icon name="building outline" size="huge" />
              <Message.Header>{t("no_classrooms")}</Message.Header>
              <p>{t("no_classrooms_msg")}</p>
            </Message>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={classroomsColumns}
                data={classrooms}
                actions={classroomsActions}
              />
            </div>
          )}
        </Tab.Pane>
      ),
    },
  ];

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
          {/* Welcome Banner */}
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

            <div
              style={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
              <h1
                style={{
                  color: COLORS.textWhite,
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  marginBottom: "0.5rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <Icon name="shield" style={{ marginRight: "0.5rem" }} />
                {t("dashboard_admin")} 🛡️
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                {t("welcome_admin", { name: user?.name })}
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            <StatCard
              icon="calendar alternate"
              label={t("total_bookings")}
              value={stats.totalBookings}
              color={COLORS.primaryRed}
            />
            <StatCard
              icon="clock outline"
              label={t("pending")}
              value={stats.pending}
              color="#ffc107"
            />
            <StatCard
              icon="check circle"
              label={t("approved")}
              value={stats.approved}
              color="#28a745"
            />
            <StatCard
              icon="times circle"
              label={t("rejected")}
              value={stats.rejected}
              color="#dc3545"
            />
            <StatCard
              icon="building"
              label={t("classrooms")}
              value={stats.totalClassrooms}
              color="#007bff"
            />
          </div>

          {/* Tabs Section */}
          <div
            style={{
              backgroundColor: COLORS.bgLight,
              borderRadius: "20px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Tab
              panes={panes}
              menu={{
                secondary: true,
                pointing: true,
                style: {
                  direction: isRTL ? "rtl" : "ltr",
                  borderBottom: `3px solid ${COLORS.primaryRed}`,
                  marginBottom: "1.5rem",
                },
              }}
            />
          </div>
        </Container>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: "", data: null })}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        loading={bookingsLoading || classroomsLoading}
      />

      {editClassroom && (
        <Modal
          open={!!editClassroom}
          onClose={() => setEditClassroom(null)}
          size="small"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Modal.Header
            style={{
              backgroundColor: COLORS.primaryRed,
              color: COLORS.textWhite,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            <Icon name="edit" />
            {t("edit_classroom")}
          </Modal.Header>
          <Modal.Content style={{ padding: SPACING.xl }}>
            <AddClassroomForm
              onSubmit={(data) => {
                dispatch(
                  updateClassroom({
                    classroomId: editClassroom.id,
                    classroomData: data,
                  })
                );
                setEditClassroom(null);
              }}
              loading={classroomsLoading}
              initialValues={editClassroom}
            />
          </Modal.Content>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
