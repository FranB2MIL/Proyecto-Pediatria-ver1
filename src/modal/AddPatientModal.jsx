import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './AddPatientModal.module.css'
import { getAvailablePatients, linkPatient } from '../services/patientService'


const AddPatientModal = ({ onClose, onPatientLinked }) => {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [linkingId, setLinkingId] = useState(null)
    const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text } 

    const handleLink = async (patient) => {
        setLinkingId(patient.id)
        setFeedback(null)
        try {
            await linkPatient(patient.id)
            setPatients((prev) => prev.filter((p) => p.id !== patient.id))
            setFeedback({ type: 'success', text: `${patient.firstName} ${patient.lastName} se agregó a tu lista.` })
            onPatientLinked()
        } catch (err) {
            if (err.status === 409) {
                setFeedback({ type: 'error', text: err.message })
                loadAvailable()
            } else if (err.status === 404) {
                setFeedback({ type: 'error', text: 'Este paciente ya no está disponible.' })
                loadAvailable()
            } else {
                setFeedback({ type: 'error', text: `No se pudo agregar al paciente: ${err.message}` })
            }
        } finally {
            setLinkingId(null)
        }
    }

    const loadAvailable = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getAvailablePatients()
            setPatients(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAvailable()
    }, [])

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className={styles.modalTitle}>Agregar Paciente</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {feedback && (
                    <p className={feedback.type === 'success' ? styles.success : styles.errorMessage}>
                        {feedback.text}
                    </p>
                )}
                {loading && <p>Cargando pacientes...</p>}

                {!loading && error && (
                    <div>
                        <p>No se pudo cargar la lista: {error}</p>
                        <button type="button" className={styles.secondaryBtn} onClick={loadAvailable}>
                            Reintentar
                        </button>
                    </div>
                )}

                {!loading && !error && patients.length === 0 && (
                    <p>No hay pacientes registrados disponibles.</p>
                )}

                {!loading && !error && patients.length > 0 && (
                    <ul className={styles.patientList}>
                        {patients.map((p) => (
                            <li key={p.id} className={styles.patientRow}>
                                <div>
                                    <strong>{p.lastName}, {p.firstName}</strong>
                                    <span className={styles.dni}>DNI {p.dni}</span>
                                </div>
                                <button
                                    type="button"
                                    className={`${styles.primaryBtn} ${styles.smallBtn}`}
                                    disabled={linkingId !== null}
                                    onClick={() => handleLink(p)}
                                >
                                    {linkingId === p.id ? 'Agregando...' : 'Agregar'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className={styles.secondaryBtn} onClick={onClose}>Cerrar</button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddPatientModal