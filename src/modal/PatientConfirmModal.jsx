import Modal from 'react-bootstrap/Modal'
import styles from './PatientConfirmModal.module.css'

// Confirmación del lado paciente (reservar / cancelar turno). El que lo abre maneja
// el envío: mientras submitting es true los botones quedan deshabilitados.
const PatientConfirmModal = ({
  title, children, confirmLabel, cancelLabel = 'Volver', danger = false, submitting, error, onConfirm, onClose,
}) => {
  const handleClose = () => {
    if (!submitting) onClose()
  }

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.message}>{children}</div>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className={styles.secondaryBtn} onClick={handleClose} disabled={submitting}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? styles.dangerBtn : styles.primaryBtn}
          onClick={onConfirm}
          disabled={submitting}
        >
          {submitting ? 'Procesando...' : confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default PatientConfirmModal
