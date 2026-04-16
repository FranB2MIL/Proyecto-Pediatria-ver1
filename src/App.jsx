import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import MyNavBar from './components/myNavBar/MyNavBar'
import PatientList from './components/patientList/patientList'
import HistoryList from './components/historyList/HistoryList'
import { PATIENTS } from './data'

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MyNavBar />

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
      </div>
    </>
  )
}

export default App
