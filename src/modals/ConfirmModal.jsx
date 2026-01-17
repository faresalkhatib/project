// src/modals/ConfirmModal.js
import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const headerStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    textAlign: isRTL ? "right" : "left",
    direction: isRTL ? "rtl" : "ltr",
  };

  const contentStyle = {
    textAlign: isRTL ? "right" : "left",
    direction: isRTL ? "rtl" : "ltr",
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
      <Modal.Actions style={{ textAlign: isRTL ? "right" : "left" }}>
        <Button onClick={onClose} style={cancelButtonStyle} disabled={loading}>
          {cancelText || t("cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          style={confirmButtonStyle}
          loading={loading}
          disabled={loading}
        >
          {confirmText || t("confirm")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmModal;
