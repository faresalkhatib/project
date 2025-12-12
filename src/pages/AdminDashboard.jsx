// src/pages/AdminDashboard.js
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
  Statistic,
} from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Table from "../components/Table";
import AddClassroomForm from "../forms/AddClassroomForm";
import ConfirmModal from "../modals/ConfirmModal";
import {
  fetchAllBookings,
  updateBookingStatus,
  deleteBooking,
  clearMessages as clearBookingMessages,
} from "../redux/bookingSlice";
import {
  fetchClassrooms,
  addClassroom,
  updateClassroom,
  deleteClassroom,
  clearMessages as clearClassroomMessages,
} from "../redux/classroomSlice";
import { COLORS, SPACING, SHADOWS } from "../utils/designConstants";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    dispatch(fetchAllBookings());
    dispatch(fetchClassrooms());
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

  const handleApproveBooking = (bookingId) => {
    setConfirmModal({
      open: true,
      type: "approve",
      data: bookingId,
      title: "الموافقة على الحجز",
      message: "هل أنت متأكد من الموافقة على هذا الحجز؟",
    });
  };

  const handleRejectBooking = (bookingId) => {
    setConfirmModal({
      open: true,
      type: "reject",
      data: bookingId,
      title: "رفض الحجز",
      message: "هل أنت متأكد من رفض هذا الحجز؟",
    });
  };

  const handleDeleteBooking = (bookingId) => {
    setConfirmModal({
      open: true,
      type: "deleteBooking",
      data: bookingId,
      title: "حذف الحجز",
      message: "هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.",
    });
  };

  const handleDeleteClassroom = (classroomId) => {
    setConfirmModal({
      open: true,
      type: "deleteClassroom",
      data: classroomId,
      title: "حذف القاعة",
      message:
        "هل أنت متأكد من حذف هذه القاعة؟ لا يمكن التراجع عن هذا الإجراء.",
    });
  };

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

  const handleAddClassroom = (classroomData) => {
    dispatch(addClassroom(classroomData));
    setShowAddClassroom(false);
  };

  const handleEditClassroom = (classroom) => {
    setEditClassroom(classroom);
  };

  const handleUpdateClassroom = (classroomData) => {
    dispatch(updateClassroom({ classroomId: editClassroom.id, classroomData }));
    setEditClassroom(null);
  };

  // Calculate statistics
  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    totalClassrooms: classrooms.length,
  };

  const containerStyle = {
    minHeight: "calc(100vh - 200px)",
    padding: `${SPACING.lg} ${SPACING.md}`,
    maxWidth: "100%",
  };

  const headerSegmentStyle = {
    background: `linear-gradient(135deg, ${COLORS.primaryRed} 0%, ${COLORS.darkRed} 100%)`,
    color: COLORS.textWhite,
    padding: SPACING.xl,
    borderRadius: "12px",
    boxShadow: SHADOWS.large,
    marginBottom: SPACING.lg,
  };

  const titleStyle = {
    color: COLORS.textWhite,
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: SPACING.sm,
    textAlign: "center",
  };

  const subtitleStyle = {
    color: COLORS.textWhite,
    fontSize: "16px",
    textAlign: "center",
    opacity: 0.95,
  };

  const segmentStyle = {
    padding: SPACING.lg,
    boxShadow: SHADOWS.medium,
    backgroundColor: COLORS.bgLight,
    borderRadius: "8px",
    marginBottom: SPACING.md,
  };

  const buttonStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
  };

  const statCardStyle = {
    textAlign: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.bgGray,
    borderRadius: "8px",
    boxShadow: SHADOWS.small,
  };

  // Bookings table columns
  const bookingsColumns = [
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
    { header: "الدكتور", accessor: "teacherName" },
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

  const bookingsActions = (row) => (
    <div style={{ display: "flex", gap: SPACING.xs, justifyContent: "center" }}>
      {row.status === "pending" && (
        <>
          <Button
            icon="check"
            size="small"
            positive
            onClick={() => handleApproveBooking(row.id)}
            title="موافقة"
          />
          <Button
            icon="times"
            size="small"
            negative
            onClick={() => handleRejectBooking(row.id)}
            title="رفض"
          />
        </>
      )}
      <Button
        icon="trash"
        size="small"
        color="red"
        onClick={() => handleDeleteBooking(row.id)}
        title="حذف"
      />
    </div>
  );

  // Classrooms table columns
  const classroomsColumns = [
    { header: "اسم القاعة", accessor: "name" },
    { header: "السعة", accessor: "capacity" },
    { header: "المبنى", accessor: "building" },
  ];

  const classroomsActions = (row) => (
    <div style={{ display: "flex", gap: SPACING.xs, justifyContent: "center" }}>
      <Button
        icon="edit"
        size="small"
        primary
        onClick={() => handleEditClassroom(row)}
        title="تعديل"
      />
      <Button
        icon="trash"
        size="small"
        negative
        onClick={() => handleDeleteClassroom(row.id)}
        title="حذف"
      />
    </div>
  );

  // Tab panes
  const panes = [
    {
      menuItem: {
        key: "bookings",
        icon: "calendar",
        content: `الحجوزات (${stats.totalBookings})`,
      },
      render: () => (
        <Tab.Pane
          style={{
            border: "none",
            boxShadow: "none",
            padding: SPACING.md,
            direction: "rtl",
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
            <div style={{ textAlign: "center", padding: SPACING.xxl }}>
              <Loader active inline="centered" size="large">
                جاري التحميل...
              </Loader>
            </div>
          ) : bookings.length === 0 ? (
            <Message info style={{ textAlign: "center" }}>
              <Icon name="inbox" size="huge" />
              <Message.Header>لا توجد حجوزات</Message.Header>
              <p>لم يتم إنشاء أي حجوزات بعد</p>
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
        content: `القاعات (${stats.totalClassrooms})`,
      },
      render: () => (
        <Tab.Pane
          style={{
            border: "none",
            boxShadow: "none",
            padding: SPACING.md,
            direction: "rtl",
          }}
        >
          <div style={{ marginBottom: SPACING.md }}>
            <Button
              style={buttonStyle}
              size="large"
              onClick={() => setShowAddClassroom(!showAddClassroom)}
            >
              <Icon
                style={{ marginRight: "0.5rem", marginLeft: "0.5rem" }}
                name={showAddClassroom ? "minus" : "plus"}
              />
              {showAddClassroom ? "إخفاء النموذج" : "إضافة قاعة جديدة"}
            </Button>
          </div>

          {showAddClassroom && (
            <Segment style={{ marginBottom: SPACING.md, padding: SPACING.lg }}>
              <h3
                style={{ color: COLORS.primaryRed, marginBottom: SPACING.md }}
              >
                <Icon name="plus circle" />
                إضافة قاعة جديدة
              </h3>
              <AddClassroomForm
                onSubmit={handleAddClassroom}
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
            <div style={{ textAlign: "center", padding: SPACING.xxl }}>
              <Loader active inline="centered" size="large">
                جاري التحميل...
              </Loader>
            </div>
          ) : classrooms.length === 0 ? (
            <Message info style={{ textAlign: "center" }}>
              <Icon name="building outline" size="huge" />
              <Message.Header>لا توجد قاعات</Message.Header>
              <p>قم بإضافة قاعة جديدة للبدء</p>
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
    <>
      <Header />
      <Container fluid style={containerStyle}>
        {/* Header Section */}
        <Segment style={headerSegmentStyle}>
          <h1 style={titleStyle}>
            <Icon name="shield" />
            لوحة التحكم - الإدارة
          </h1>
          <p style={subtitleStyle}>
            مرحباً {user?.name}، إدارة الحجوزات والقاعات الدراسية
          </p>
        </Segment>

        {/* Statistics Cards */}
        <Grid columns={5} stackable style={{ marginBottom: SPACING.lg }}>
          <Grid.Column>
            <div style={statCardStyle}>
              <Statistic size="small">
                <Statistic.Value style={{ color: COLORS.primaryRed }}>
                  <Icon name="calendar alternate" />
                  {stats.totalBookings}
                </Statistic.Value>
                <Statistic.Label>إجمالي الحجوزات</Statistic.Label>
              </Statistic>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={statCardStyle}>
              <Statistic size="small">
                <Statistic.Value style={{ color: COLORS.pending }}>
                  <Icon name="clock" />
                  {stats.pending}
                </Statistic.Value>
                <Statistic.Label>قيد الانتظار</Statistic.Label>
              </Statistic>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={statCardStyle}>
              <Statistic size="small">
                <Statistic.Value style={{ color: COLORS.success }}>
                  <Icon name="check circle" />
                  {stats.approved}
                </Statistic.Value>
                <Statistic.Label>مقبولة</Statistic.Label>
              </Statistic>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={statCardStyle}>
              <Statistic size="small">
                <Statistic.Value style={{ color: COLORS.error }}>
                  <Icon name="times circle" />
                  {stats.rejected}
                </Statistic.Value>
                <Statistic.Label>مرفوضة</Statistic.Label>
              </Statistic>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={statCardStyle}>
              <Statistic size="small">
                <Statistic.Value style={{ color: COLORS.primaryRed }}>
                  <Icon name="building" />
                  {stats.totalClassrooms}
                </Statistic.Value>
                <Statistic.Label>القاعات</Statistic.Label>
              </Statistic>
            </div>
          </Grid.Column>
        </Grid>

        {/* Main Content */}
        <Segment style={segmentStyle}>
          <Tab
            panes={panes}
            style={{ direction: "rtl" }}
            menu={{
              secondary: true,
              pointing: true,
              style: {
                direction: "rtl",
                borderBottom: `3px solid ${COLORS.primaryRed}`,
              },
            }}
          />
        </Segment>
      </Container>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: "", data: null })}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        loading={bookingsLoading || classroomsLoading}
      />

      {/* Edit Classroom Modal */}
      <Modal
        open={!!editClassroom}
        onClose={() => setEditClassroom(null)}
        size="small"
        style={{ direction: "rtl" }}
      >
        <Modal.Header
          style={{
            backgroundColor: COLORS.primaryRed,
            color: COLORS.textWhite,
            textAlign: "right",
          }}
        >
          <Icon name="edit" />
          تعديل القاعة
        </Modal.Header>
        <Modal.Content style={{ padding: SPACING.xl }}>
          {editClassroom && (
            <AddClassroomForm
              onSubmit={handleUpdateClassroom}
              loading={classroomsLoading}
              initialValues={editClassroom}
            />
          )}
        </Modal.Content>
      </Modal>

      <Footer />
    </>
  );
};

export default AdminDashboard;
