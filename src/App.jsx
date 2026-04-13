import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import MyNavBar from './components/myNavBar/MyNavBar'
import PatientList from './components/patientList/patientList'


function App() {

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        <MyNavBar/>
        
        <div className='main-container-0'>
          
          <PatientList/>
          
          <PatientCard/>
        
        </div>

      </div>
    </>
  )

}

export default App
