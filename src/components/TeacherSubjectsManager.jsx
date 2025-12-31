// src/components/TeacherSubjectsManager.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Table,
  Icon,
  Message,
  Loader,
  Label,
} from "semantic-ui-react";
import {
  getTeacherSubjects,
  addSubjectToTeacher,
  removeSubjectFromTeacher,
  clearMessages,
} from "../redux/teacherSubjectsSlice";
import ConfirmModal from "../modals/ConfirmModal";
import { COLORS, SPACING } from "../utils/designConstants";

const TeacherSubjectsManager = ({ teacherId }) => {
  const dispatch = useDispatch();
  const { subjects, loading, error, successMessage } = useSelector(
    (state) => state.teacherSubjects
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    subjectNumber: "",
    subjectName: "",
    subjectSubNumber: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    subject: null,
  });

  useEffect(() => {
    if (teacherId) {
      dispatch(getTeacherSubjects(teacherId));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!formData.subjectNumber || !formData.subjectName) {
      return;
    }

    const result = await dispatch(
      addSubjectToTeacher({
        teacherId,
        subject: formData,
      })
    );

    if (!result.error) {
      setFormData({
        subjectNumber: "",
        subjectName: "",
        subjectSubNumber: "",
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveSubject = (subject) => {
    setConfirmModal({ open: true, subject });
  };

  const handleConfirmRemove = () => {
    dispatch(
      removeSubjectFromTeacher({
        teacherId,
        subjectNumber: confirmModal.subject.subjectNumber,
        subjectSubNumber: confirmModal.subject.subjectSubNumber,
      })
    );
    setConfirmModal({ open: false, subject: null });
  };

  const inputStyle = {
    direction: "rtl",
    textAlign: "right",
  };

  return (
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: showAddForm ? "clamp(1.5rem, 3vw, 2rem)" : 0,
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
            المواد المسجلة للتدريس
          </h3>
        </div>
        <Button
          style={{
            backgroundColor: showAddForm ? "#6c757d" : COLORS.primaryRed,
            color: COLORS.textWhite,
            borderRadius: "12px",
            padding: "0.8rem 1.5rem",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            fontWeight: "600",
            border: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(139, 0, 0, 0.3)",
          }}
          onClick={() => {
            setShowAddForm(!showAddForm);
            dispatch(clearMessages());
          }}
        >
          <Icon name={showAddForm ? "minus" : "plus"} />
          {showAddForm ? "إخفاء" : "إضافة مادة"}
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <Message
          negative
          style={{
            textAlign: "center",
            borderRadius: "12px",
            marginBottom: "1rem",
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
            marginBottom: "1rem",
          }}
        >
          {successMessage}
        </Message>
      )}

      {/* Add Subject Form */}
      {showAddForm && (
        <div
          style={{
            padding: "clamp(1rem, 2.5vw, 1.5rem)",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "2px solid #e9ecef",
            marginBottom: "1.5rem",
          }}
        >
          <Form onSubmit={handleAddSubject}>
            <Form.Field required>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                رقم المادة
              </label>
              <input
                type="text"
                name="subjectNumber"
                placeholder="مثال: CS101"
                value={formData.subjectNumber}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </Form.Field>

            <Form.Field required>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                اسم المادة
              </label>
              <input
                type="text"
                name="subjectName"
                placeholder="مثال: مقدمة في علوم الحاسوب"
                value={formData.subjectName}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </Form.Field>

            <Form.Field>
              <label style={{ textAlign: "right", color: COLORS.textPrimary }}>
                الشعبة
              </label>
              <input
                type="text"
                name="subjectSubNumber"
                placeholder="مثال: 1"
                value={formData.subjectSubNumber}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </Form.Field>

            <Button
              type="submit"
              loading={loading}
              style={{
                backgroundColor: COLORS.primaryRed,
                color: COLORS.textWhite,
                width: "100%",
                marginTop: SPACING.md,
              }}
            >
              إضافة المادة
            </Button>
          </Form>
        </div>
      )}

      {/* Subjects List */}
      {loading && !showAddForm ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Loader active inline="centered">
            جاري التحميل...
          </Loader>
        </div>
      ) : subjects.length === 0 ? (
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
            لا توجد مواد مسجلة. اضغط على "إضافة مادة" للبدء.
          </p>
        </div>
      ) : (
        <Table celled striped style={{ direction: "rtl" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>رقم المادة</Table.HeaderCell>
              <Table.HeaderCell>اسم المادة</Table.HeaderCell>
              <Table.HeaderCell>الشعبة</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">الإجراءات</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {subjects.map((subject, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Label color="blue">{subject.subjectNumber}</Label>
                </Table.Cell>
                <Table.Cell>{subject.subjectName}</Table.Cell>
                <Table.Cell>
                  {subject.subjectSubNumber || "غير محدد"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Button
                    icon
                    size="small"
                    negative
                    onClick={() => handleRemoveSubject(subject)}
                    title="حذف المادة"
                  >
                    <Icon name="trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, subject: null })}
        onConfirm={handleConfirmRemove}
        title="حذف المادة"
        message="هل أنت متأكد من حذف هذه المادة؟ لن تتمكن من إنشاء حجوزات لهذه المادة بعد الحذف."
        loading={loading}
      />
    </div>
  );
};

export default TeacherSubjectsManager;
