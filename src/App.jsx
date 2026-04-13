import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import MyNavBar from './components/myNavBar/MyNavBar'



function App() {

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        <MyNavBar/>
        
        <div style={{ display: 'flex', flex: 1 }}>
          
          <div style={{ width: '380px', background: '#FFB3B3' }}>
            Lista
          </div>
          
          <div style={{ flex: 1, background: '#B3D9FF' }}>
            Carta paciente
          </div>
        
        </div>

      </div>
    </>
  )

}

export default App
