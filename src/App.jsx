import { useState } from 'react'
import PatientCard from './components/patientCard/PatientCard'
import PatientList from './components/patientList/patientList'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <PatientCard />
    </div>
    </>
  )
}

export default App
