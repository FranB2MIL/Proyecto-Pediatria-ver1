import Modal from 'react-bootstrap/Modal'
import styles from './ConfirmModal.module.css'

const ConfirmModal = ({ message, onConfirm, onClose}) => {
    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className={styles.modalTitle}>Confirmar accion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className={styles.message}>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className={styles.secondaryBtn} onClick={onClose}>Cancelar</button>
                <button className={styles.dangerBtn} onClick={onConfirm}>Eliminar</button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal;