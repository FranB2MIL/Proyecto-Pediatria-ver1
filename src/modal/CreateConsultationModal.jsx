import { useState } from 'react';
import { initialConsultationsForm } from './createConsultationModalHelper.js';
import Modal from 'react-bootstrap/Modal';
import { ModalFooter } from 'react-bootstrap';
import styles from './CreateConsultationModal.module.css';


const CreateConsultationModal = ({modalTitle, onClose, onSave, initialData = null}) => {
    const [formData, setFormData] = useState(initialData || initialConsultationsForm)

    const handleInputChange = (event, inputKey) => {
        setFormData(prevFormData => ({
                ...prevFormData,
                [inputKey] : event.target.value
    }));
    }


const handleMeasurementChange = (event, measurementKey) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            measurement: {
                ...prevFormData.measurement,
                [measurementKey]: event.target.value
            }
        }));
    };


    const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialConsultationsForm);
    }

return (
    <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>

                <Modal.Title className={styles.modalTitle}>{modalTitle}</Modal.Title>

            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit} id="Consultation-form" className={styles.form}>
                    <input
                        className={styles.input}
                        type = "date"
                        placeholder = "Fecha"
                        value = {formData.date}
                        onChange = {(event) => handleInputChange(event , "date")}
                    />
                    <input
                        className={styles.input}
                        type = "text"
                        placeholder = "Motivo"
                        value = {formData.reason}
                        onChange={(event) => handleInputChange(event, "reason")}
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder = "Detalles de la consulta"
                        value = {formData.description}
                        onChange={(event) => handleInputChange(event, "description")}


                    />
                    <label className={styles.label} htmlFor="weight">Peso (kg)</label>
                    <input
                        className={styles.input}
                        id="weight"
                        type="number"
                        placeholder="Peso"
                        value={formData.measurement.weight}
                        onChange={(event) => handleMeasurementChange(event, "weight")}
                    />
                    <label className={styles.label} htmlFor="height">Altura (cm)</label>
                    <input
                        className={styles.input}
                        id="height"
                        type="number"
                        placeholder="Altura"
                        value={formData.measurement.height}
                        onChange={(event) => handleMeasurementChange(event, "height")}
                    />
                    <label className={styles.label} htmlFor="size">Tamaño</label>
                    <input
                        className={styles.input}
                        id="size"
                        type="number"
                        placeholder="Tamaño / Perímetro"
                        value={formData.measurement.size}
                        onChange={(event) => handleMeasurementChange(event, "size")}
                    />

                </form>
            </Modal.Body>
            <ModalFooter>
                <button type="button"  className={styles.secondaryBtn}  onClick={onClose}>Cancelar</button>
                <button type="submit" form="Consultation-form" className={styles.primaryBtn}>Guardar</button>
            </ModalFooter>
    </Modal>


)
}
export default CreateConsultationModal;
