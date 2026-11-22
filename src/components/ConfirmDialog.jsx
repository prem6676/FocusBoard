import { AlertTriangle } from 'lucide-react';
import './modals.css';

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <div
        className="modal modal--danger"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className="modal__body" style={{ paddingBottom: 0 }}>
          <div className="confirm-dialog__icon" aria-hidden="true">
            <AlertTriangle size={22} />
          </div>
          <h2 id="confirm-dialog-title" className="modal__title" style={{ textAlign: 'center', marginBottom: 8 }}>
            {title}
          </h2>
          <p id="confirm-dialog-message" className="confirm-dialog__text">
            {message}
          </p>
        </div>
        <div className="modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
