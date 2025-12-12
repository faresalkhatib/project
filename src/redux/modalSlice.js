// src/redux/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalType: null,
  modalProps: {},
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props || {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
