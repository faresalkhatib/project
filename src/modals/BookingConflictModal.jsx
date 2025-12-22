// src/components/modals/BookingConflictModal.js
import React from "react";
import { Modal, Button, Icon, Header } from "semantic-ui-react";

export default function BookingConflictModal({ open, onClose, message }) {
  return (
    <Modal open={open} onClose={onClose} size="tiny" dir="rtl">
      <Modal.Header>
        <Icon name="warning sign" color="red" />
        تحذير - تعارض في الحجز
      </Modal.Header>
      <Modal.Content>
        <Header as="h3" color="red" textAlign="center">
          <Icon name="calendar times" />
          <Header.Content>لا يمكن إتمام الحجز</Header.Content>
        </Header>
        <p style={{ fontSize: "16px", textAlign: "center", marginTop: "20px" }}>
          {message || "هذه القاعة محجوزة في نفس الوقت والتاريخ"}
        </p>
        <p style={{ textAlign: "center", color: "#666", marginTop: "10px" }}>
          الرجاء اختيار وقت أو قاعة أخرى
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="blue" onClick={onClose}>
          <Icon name="checkmark" />
          فهمت
        </Button>
      </Modal.Actions>
    </Modal>
  );
}