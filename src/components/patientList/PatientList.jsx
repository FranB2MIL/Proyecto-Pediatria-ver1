import { useState, useEffect } from 'react'
import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { getAllPatients } from '../../services/patientService'
import AddPatientModal from '../../modal/AddPatientModal'
import { normalize } from '../../utils/text'

const PatientList = ({ onSelectPatient, deletedPatientId }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')

  const loadPatients = async () => {
    try {
      setError(null)
      const data = await getAllPatients()
      setPatients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (deletedPatientId) {
      setPatients(prev => prev.filter(p => p.id !== deletedPatientId))
    }
  }, [deletedPatientId])

  const term = normalize(query.trim())
  const filtered = patients.filter((p) =>
    normalize(p.firstName).includes(term) ||
    normalize(p.lastName).includes(term) ||
    normalize(String(p.dni)).includes(term)
  )

  return (
    <div className={styles.patientlist}>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar paciente..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>Agregar Paciente</button>
      </div>

      {isModalOpen && (
        <AddPatientModal
          onClose={() => setIsModalOpen(false)}
          onPatientLinked={loadPatients}
        />
      )}

      <div className={styles.listContainer}>
        {loading && <p className={styles.emptyState}>Cargando pacientes...</p>}
        {error && <p className={styles.emptyState}>Error: {error}</p>}

        {!loading && !error && patients.length === 0 && (
          <p className={styles.emptyState}>
            Todavía no agregaste pacientes. Usá «Agregar Paciente» para buscarlos.
          </p>
        )}

        {!loading && !error && patients.length > 0 && filtered.length === 0 && (
          <p className={styles.emptyState}>Ningún paciente coincide con "{query}".</p>
        )}

        {!loading && !error && filtered.map((patient) => (
          <PatientListItem
            key={patient.id}
            patient={patient}
            onSelectPatient={onSelectPatient}
          />
        ))}
      </div>

    </div>
  )
}

export default PatientList