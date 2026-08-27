import { useState } from 'react';
import { initialConsultationsForm } from './CreateConsultationModalHelper.js';
import Modal from 'react-bootstrap/Modal';
import { ModalFooter } from 'react-bootstrap';
import styles from './CreatePacientModal.module.css';


const createConsultation = ({modalTitle, onClose, onSave}) => {
    const [formData, setFormData] = useState(initialConsultationsForm)

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

                <Modal.Title>{modalTitle}</Modal.Title>

            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit} id="Consultation-form">
                    <input

                        type = "date"
                        placeholder = "Fecha"
                        value = {formData.date}
                        onChange = {(event) => handleInputChange(event , "date")}
                    />
                    <input
                        type = "text"
                        placeholder = "Motivo"
                        value = {formData.reason}
                        onChange={(event) => handleInputChange(event, "reason")}
                    />
                    <textarea
                        placeholder = "Detalles de la consulta"
                        value = {formData.description}
                        onChange={(event) => handleInputChange(event, "description")}
                        

                    />
                    <label htmlFor="weight">Peso (kg)</label>
                    <input
                        id="weight"
                        type="number"
                        placeholder="Peso"
                        value={formData.measurement.weight}
                        onChange={(event) => handleMeasurementChange(event, "weight")}
                    />
                    <label htmlFor="height">Altura (cm)</label>
                    <input
                        id="height"
                        type="number"
                        placeholder="Altura"
                        value={formData.measurement.height}
                        onChange={(event) => handleMeasurementChange(event, "height")}
                    />
                    <label htmlFor="size">Tamaño</label>
                    <input
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
export default createConsultation;
