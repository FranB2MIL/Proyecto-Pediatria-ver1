import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import MyNavBar from './components/myNavBar/MyNavBar'
import PatientList from './components/patientList/PatientList'
import HistoryList from './components/historyList/HistoryList'
import { PATIENTS } from './data'
import { Routes, Route } from 'react-router-dom'
import PatientsView from './views/PatientsView'
import AppointmentsView from './views/AppointmentsView'

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MyNavBar />
        <Routes>
          <Route path="/" element={<PatientsView />} />
          <Route path="/turnos" element={<AppointmentsView />} />
        </Routes>
        {/* <div className="main-container-0">

          <PatientList onSelectPatient={handleSelectPatient} />

          <div className="patient-info-container">

            <div style={{ flex: 5, background: '#B3D9FF' }}>
              <PatientCard {...selectedPatient} />
            </div>

            <div style={{ flex: 5, background: '#B3FFB3' }}>
              <HistoryList {...selectedPatient} />
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default App
