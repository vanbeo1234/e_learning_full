import React from 'react';
import '../../Style/adcm.css';

const ConfirmModalCourse = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal confirm-modal">
      <div className="confirm-modal-content">
        <h2>Xác nhận</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-red" onClick={onCancel}>Hủy</button>
          <button className="btn btn-green" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalCourse;
