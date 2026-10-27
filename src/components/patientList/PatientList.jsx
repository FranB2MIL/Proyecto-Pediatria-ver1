import { useState } from 'react'
import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import AddPatientModal from '../../modal/AddPatientModal'
import { normalize } from '../../utils/text'

const PatientList = ({ patients, loading, error, onPatientLinked, onSelectPatient, selectedPatientId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')

  const term = normalize(query.trim())
  const filtered = patients.filter((p) =>
    normalize(p.firstName).includes(term) ||
    normalize(p.lastName).includes(term) ||
    normalize(String(p.dni)).includes(term)
  )

  return (
    <div className={styles.patientlist}>

      <div className={styles.searchContainer}>
        <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>Agregar Paciente</button>
        <input
          type="text"
          placeholder="Buscar paciente..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isModalOpen && (
        <AddPatientModal
          onClose={() => setIsModalOpen(false)}
          onPatientLinked={onPatientLinked}
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
            isSelected={patient.id === selectedPatientId}
          />
        ))}
      </div>

    </div>
  )
}

export default PatientList