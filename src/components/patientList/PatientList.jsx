import { useState, useEffect } from 'react'
import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { getAllPatients } from '../../services/patientService'

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const doctorId = 1 // hardcodeado por ahora

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getAllPatients(doctorId)
        setPatients(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return (
    <div className={styles.patientlist}>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="Buscar paciente..." className={styles.searchInput} />
      </div>

      <div className={styles.listContainer}>
        {loading && <p>Cargando pacientes...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && patients.map((paciente) => (
          <PatientListItem
            key={paciente.id}
            patient={paciente}
            onSelectPatient={onSelectPatient}
          />
        ))}
      </div>

    </div>
  )
}

export default PatientList
