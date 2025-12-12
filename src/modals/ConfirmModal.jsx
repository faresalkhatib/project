// src/modals/ConfirmModal.js
import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading,
}) => {
  const headerStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    textAlign: "right",
    direction: "rtl",
  };

  const contentStyle = {
    textAlign: "right",
    direction: "rtl",
    fontSize: "16px",
  };

  const confirmButtonStyle = {
    backgroundColor: COLORS.success,
    color: COLORS.textWhite,
  };

  const cancelButtonStyle = {
    backgroundColor: COLORS.error,
    color: COLORS.textWhite,
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header style={headerStyle}>{title}</Modal.Header>
      <Modal.Content style={contentStyle}>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions style={{ textAlign: "left" }}>
        <Button onClick={onClose} style={cancelButtonStyle} disabled={loading}>
          {cancelText || "إلغاء"}
        </Button>
        <Button
          onClick={onConfirm}
          style={confirmButtonStyle}
          loading={loading}
          disabled={loading}
        >
          {confirmText || "تأكيد"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmModal;
