// src/pages/MaintenanceDashboard.js
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
  Modal,
  TextArea,
} from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Table from "../components/Table";
import ConfirmModal from "../modals/ConfirmModal";
import {
  subscribeToAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  clearMessages,
  cleanup as cleanupComplaints,
} from "../redux/maintenanceSlice";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

const MaintenanceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { complaints, loading, error, successMessage } = useSelector(
    (state) => state.maintenance
  );

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    data: null,
  });
  const [notesModal, setNotesModal] = useState({
    open: false,
    complaintId: null,
    status: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin" && user?.role !== "maintenance") {
      navigate("/");
      return;
    }

    dispatch(subscribeToAllComplaints());

    return () => {
      dispatch(cleanupComplaints());
    };
  }, [dispatch, user, isAuthenticated, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    disregarded: complaints.filter((c) => c.status === "disregarded").length,
  };

  const handleConfirm = () => {
    const { type, data } = confirmModal;
    if (type === "delete") {
      dispatch(deleteComplaint(data));
    }
    setConfirmModal({ open: false, type: "", data: null });
  };

  const handleStatusUpdate = () => {
    const { complaintId, status, notes } = notesModal;
    dispatch(updateComplaintStatus({ complaintId, status, notes }));
    setNotesModal({ open: false, complaintId: null, status: "", notes: "" });
  };

  const openNotesModal = (complaintId, status) => {
    setNotesModal({ open: true, complaintId, status, notes: "" });
  };

  // Stats Card Component
  const StatCard = ({ icon, label, value, color }) => (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
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

  const columns = [
    { header: t("classroom"), accessor: "classroomName" },
    { header: t("reported_by"), accessor: "userName" },
    { header: t("email"), accessor: "userEmail" },
    {
      header: t("description"),
      accessor: "description",
      render: (row) => (
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={row.description}
        >
          {row.description}
        </div>
      ),
    },
    {
      header: t("date"),
      accessor: "createdAt",
      render: (row) =>
        row.createdAt
          ?.toDate?.()
          ?.toLocaleDateString(isRTL ? "ar-JO" : "en-US") || "-",
    },
    {
      header: t("status"),
      accessor: "status",
      render: (row) => {
        const statusColors = {
          pending: "yellow",
          in_progress: "blue",
          resolved: "green",
          disregarded: "grey",
        };
        const statusText = {
          pending: t("pending"),
          in_progress: t("in_progress"),
          resolved: t("resolved"),
          disregarded: t("disregarded"),
        };
        return (
          <Label
            color={statusColors[row.status]}
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {statusText[row.status]}
          </Label>
        );
      },
    },
  ];

  const actions = (row) => (
    <div
      style={{
        display: "flex",
        gap: SPACING.xs,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {row.status === "pending" && (
        <Button
          icon="play"
          size="small"
          color="blue"
          onClick={() => openNotesModal(row.id, "in_progress")}
          title={t("start_work")}
        />
      )}
      {row.status === "in_progress" && (
        <Button
          icon="check"
          size="small"
          positive
          onClick={() => openNotesModal(row.id, "resolved")}
          title={t("mark_resolved")}
        />
      )}
      {row.status !== "disregarded" && row.status !== "resolved" && (
        <Button
          icon="ban"
          size="small"
          color="grey"
          onClick={() => openNotesModal(row.id, "disregarded")}
          title={t("disregard")}
        />
      )}
      <Button
        icon="trash"
        size="small"
        negative
        onClick={() =>
          setConfirmModal({
            open: true,
            type: "delete",
            data: row.id,
            title: t("delete_complaint"),
            message: t("delete_complaint_msg"),
          })
        }
        title={t("delete")}
      />
    </div>
  );

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
              background: `linear-gradient(135deg, #ffc107 0%, #ff9800 100%)`,
              borderRadius: "20px",
              padding: "clamp(2rem, 4vw, 3rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              boxShadow: "0 10px 40px rgba(255, 193, 7, 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                [isRTL ? "right" : "left"]: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
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
                background: "rgba(255,255,255,0.1)",
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
                <Icon name="wrench" style={{ marginRight: "0.5rem" }} />
                {t("maintenance_dashboard")} 🔧
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                {t("welcome_maintenance", { name: user?.name })}
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            <StatCard
              icon="clipboard list"
              label={t("total_complaints")}
              value={stats.total}
              color="#6c757d"
            />
            <StatCard
              icon="clock outline"
              label={t("pending")}
              value={stats.pending}
              color="#ffc107"
            />
            <StatCard
              icon="tasks"
              label={t("in_progress")}
              value={stats.inProgress}
              color="#007bff"
            />
            <StatCard
              icon="check circle"
              label={t("resolved")}
              value={stats.resolved}
              color="#28a745"
            />
            <StatCard
              icon="ban"
              label={t("disregarded")}
              value={stats.disregarded}
              color="#6c757d"
            />
          </div>

          {/* Complaints Table */}
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
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, #ffc107, #ff9800)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  name="wrench"
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
                {t("all_complaints")}
              </h2>
            </div>

            {error && (
              <Message negative style={{ textAlign: "center" }}>
                {error}
              </Message>
            )}

            {successMessage && (
              <Message positive style={{ textAlign: "center" }}>
                {successMessage}
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
            ) : complaints.length === 0 ? (
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
                  {t("no_complaints")}
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
                <Table columns={columns} data={complaints} actions={actions} />
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Footer */}
      <Footer />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: "", data: null })}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        loading={loading}
      />

      {/* Notes Modal */}
      <Modal
        open={notesModal.open}
        onClose={() =>
          setNotesModal({
            open: false,
            complaintId: null,
            status: "",
            notes: "",
          })
        }
        size="small"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <Modal.Header
          style={{
            backgroundColor: "#ffc107",
            color: COLORS.textPrimary,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          <Icon name="edit" />
          {t("update_status")}
        </Modal.Header>
        <Modal.Content style={{ padding: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontWeight: "600",
                color: COLORS.textPrimary,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              {t("notes_optional")}
            </label>
            <TextArea
              placeholder={t("add_notes_placeholder")}
              value={notesModal.notes}
              onChange={(e) =>
                setNotesModal({ ...notesModal, notes: e.target.value })
              }
              rows={4}
              style={{
                width: "100%",
                direction: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <Button
              onClick={handleStatusUpdate}
              loading={loading}
              disabled={loading}
              style={{
                backgroundColor: "#ffc107",
                color: COLORS.textPrimary,
                flex: 1,
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              {t("confirm")}
            </Button>
            <Button
              onClick={() =>
                setNotesModal({
                  open: false,
                  complaintId: null,
                  status: "",
                  notes: "",
                })
              }
              disabled={loading}
              style={{
                backgroundColor: "#6c757d",
                color: COLORS.textWhite,
                flex: 1,
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              {t("cancel")}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default MaintenanceDashboard;
