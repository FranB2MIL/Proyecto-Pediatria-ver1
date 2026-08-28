import { useState } from 'react'
import PatientList from '../components/patientList/PatientList'
import PatientCard from '../components/patientCard/PatientCard'
import HistoryList from '../components/historyList/HistoryList'
import styles from './PatientsView.module.css'

function PatientsView() {
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }

  const handleDeletePatient = (id) => {
  setSelectedPatient(null)
  setDeletedPatientId(id)
}

const [deletedPatientId, setDeletedPatientId] = useState(null)

  return (
    <div className={styles.pageContainer}>
      <PatientList onSelectPatient={handleSelectPatient} deletedPatientId={deletedPatientId}/>
      <div className={styles.infoColumn}>
        {selectedPatient ? (
          <>
            <div className={styles.cardSection}>
              <PatientCard {...selectedPatient} onDelete={handleDeletePatient} />
            </div>
            <div className={styles.historySection}>
              <HistoryList {...selectedPatient} />
            </div>
          </>
        ) : (
          <p>Seleccioná un paciente de la lista para ver su información</p>
        )}
      </div>
    </div>
  )
}

export default PatientsView