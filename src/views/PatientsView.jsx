import { useState } from 'react'
import PatientList from '../components/patientList/PatientList'
import PatientCard from '../components/patientCard/PatientCard'
import HistoryList from '../components/historyList/HistoryList'

function PatientsView() {
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }

  return (
    <div className="main-container-0">
      <PatientList onSelectPatient={handleSelectPatient} />
      <div className="patient-info-container">
        <div style={{ flex: 5, background: '#B3D9FF' }}>
          <PatientCard {...selectedPatient} />
        </div>
        <div style={{ flex: 5, background: '#B3FFB3' }}>
          <HistoryList {...selectedPatient} />
        </div>
      </div>
    </div>
  )
}

export default PatientsView