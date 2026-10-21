import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './AddPatientModal.module.css'
import { getAvailablePatients, linkPatient } from '../services/patientService'
import { normalize } from '../utils/text'



const AddPatientModal = ({ onClose, onPatientLinked }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [linkingId, setLinkingId] = useState(null)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text }
  const [query, setQuery] = useState('')

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

  const term = normalize(query.trim())
  const filtered = patients.filter((p) =>
    normalize(p.firstName).includes(term) ||
    normalize(p.lastName).includes(term) ||
    normalize(String(p.dni)).includes(term)
  )

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

        {!loading && !error && patients.length > 0 && (
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre o DNI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        {loading && <p className={styles.emptyState}>Cargando pacientes...</p>}

        {!loading && error && (
          <div>
            <p className={styles.emptyState}>No se pudo cargar la lista: {error}</p>
            <button type="button" className={styles.secondaryBtn} onClick={loadAvailable}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && patients.length === 0 && (
          <p className={styles.emptyState}>No hay pacientes registrados disponibles.</p>
        )}

        {!loading && !error && patients.length > 0 && filtered.length === 0 && (
          <p className={styles.emptyState}>Ningún paciente coincide con "{query}".</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ul className={styles.patientList}>
            {filtered.map((p) => (
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