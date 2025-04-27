// File: components/UserManagement/Function/Confirm.jsx
import React from 'react';
import '../../Style/adum.css';

const ConfirmModal = ({ hideConfirmModal, currentAction }) => {
  return (
    <div id="confirmModal" className="modal confirm-modal">
      <div className="modal-content">
        <span className="modal-close-btn" onClick={hideConfirmModal}>×</span>
        <h2 className="modal-h2">Bạn muốn xác nhận thao tác này?</h2>
        <div className="modal-buttons">
          <button className="modal-button-submit" onClick={() => {
            if (currentAction) currentAction();
            hideConfirmModal();
          }}>
            Xác nhận
          </button>
          <button className="modal-button-reset" onClick={hideConfirmModal}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
