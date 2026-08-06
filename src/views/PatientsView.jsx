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

  return (
    <div className={styles.pageContainer}>
      <PatientList onSelectPatient={handleSelectPatient} />
      <div className={styles.infoColumn}>
        <div className={styles.cardSection}>
          <PatientCard {...selectedPatient} />
        </div>
        <div className={styles.historySection}>
          <HistoryList {...selectedPatient} />
        </div>
      </div>
    </div>
  )
}

export default PatientsView