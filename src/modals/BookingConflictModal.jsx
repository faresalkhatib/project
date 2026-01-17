// src/components/modals/BookingConflictModal.js
import React from "react";
import { Modal, Button, Icon, Header } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

export default function BookingConflictModal({ open, onClose, message }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="tiny"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Modal.Header>
        <Icon name="warning sign" color="red" />
        {t("warning_booking_conflict")}
      </Modal.Header>
      <Modal.Content>
        <Header as="h3" color="red" textAlign="center">
          <Icon name="calendar times" />
          <Header.Content>{t("cannot_complete_booking")}</Header.Content>
        </Header>
        <p style={{ fontSize: "16px", textAlign: "center", marginTop: "20px" }}>
          {message || t("classroom_booked_same_time")}
        </p>
        <p style={{ textAlign: "center", color: "#666", marginTop: "10px" }}>
          {t("choose_different_time")}
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="blue" onClick={onClose}>
          <Icon name="checkmark" />
          {t("understood")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
