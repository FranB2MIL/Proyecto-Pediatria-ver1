import { useState } from 'react';
import { initialPatientsForm } from './modalHelper.js';

import Modal from 'react-bootstrap/Modal';
import styles from './CreateModal.module.css';

const CreateModal = ({ onClose, onSave, modalTitle }) => {

    const [formData, setformData] = useState(initialPatientsForm);

    const handleInputChange = (event, inputKey) => {
        setformData(prevFormData => ({
            ...prevFormData,
            [inputKey]: event.target.value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className={styles.modalTitle}>{modalTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit} id="patient-form" className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={(event) => handleInputChange(event, 'firstName')}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={(event) => handleInputChange(event, 'lastName')}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="DNI"
                        value={formData.dni}
                        onChange={(event) => handleInputChange(event, 'dni')}
                    />
                    <input
                        className={styles.input}
                        type="date"
                        placeholder="Fecha de nacimiento"
                        value={formData.dateOfBirth}
                        onChange={(event) => handleInputChange(event, 'dateOfBirth')}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Obra social"
                        value={formData.healthInsurance}
                        onChange={(event) => handleInputChange(event, 'healthInsurance')}
                    />
                </form>
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className={styles.secondaryBtn} onClick={onClose}>Cancelar</button>
                <button type="submit" form="patient-form" className={styles.primaryBtn}>Guardar</button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateModal;
