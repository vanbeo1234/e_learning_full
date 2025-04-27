import React from 'react';
import '../../Style/adcm.css';

const Modala = ({
  show, // For compatibility with AddCourse
  type, // New prop used in EditCourse ("success" or "cancel")
  title,
  content,
  onClose,
  onConfirm,
  onCancel, // For compatibility with AddCourse
  confirmText = 'OK', // For compatibility with AddCourse
  cancelText = 'Cancel', // For compatibility with AddCourse
  modalClass = 'add-modal', // For compatibility with AddCourse
  children, // For compatibility with AddCourse
}) => {
  // Use 'show' prop for AddCourse compatibility, otherwise assume modal is shown if type/title/content are provided
  const isVisible = show !== undefined ? show : !!(type || title || content);

  if (!isVisible) return null;

  return (
    <div className={`modal ${modalClass}`}>
      <div className="modal-content">
        <span className="modal-close-btn" onClick={onClose || onCancel}>×</span>
        <h2 className="modal-h2">{title}</h2>
        <div className="modal-body">
          {children || (content && <p>{content}</p>)}
        </div>
        <div className="modal-buttons">
          {type === 'success' && (
            // Success modal: only a close/confirm button
            <button className="modal-button-submit" onClick={onConfirm || onClose}>
              {confirmText}
            </button>
          )}
          {type === 'cancel' && (
            // Cancel modal: confirm and cancel buttons
            <>
              <button className="modal-button-submit" onClick={onConfirm}>
                {confirmText || 'Xác nhận'}
              </button>
              <button className="modal-button-reset" onClick={onClose || onCancel}>
                {cancelText || 'Hủy'}
              </button>
            </>
          )}
          {/* For AddCourse compatibility: render buttons if type is not specified */}
          {!type && (
            <>
              <button className="modal-button-submit" onClick={onConfirm}>
                {confirmText}
              </button>
              <button className="modal-button-reset" onClick={onCancel}>
                {cancelText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modala;