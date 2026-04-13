import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import MyNavBar from './components/myNavBar/MyNavBar'
import PatientList from './components/patientList/patientList'
import HistoryList from './components/historyList/HistoryList'

function App() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MyNavBar />

        <div className="main-container-0">
       
          <div className='search-and-patient-list-container'>
            <PatientList />
          </div>

          <div className="patient-info-container">
            
            <div style={{ flex: 5, background: '#B3D9FF' }}>
              <PatientCard />
            </div>

            <div style={{ flex: 5, background: '#B3FFB3' }}>
              <HistoryList />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
