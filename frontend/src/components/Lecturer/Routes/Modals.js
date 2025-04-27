import React from 'react';
import './giangvien.css';
const Modal = ({ show, title, onConfirm, onCancel, children }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}
        <div className="modal-buttons">
          {onConfirm && <button onClick={onConfirm}>Xác nhận</button>}
          {onCancel && <button onClick={onCancel}>Hủy</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;