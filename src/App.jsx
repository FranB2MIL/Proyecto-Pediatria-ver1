import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route } from 'react-router-dom'
import PatientsView from './views/PatientsView'
import AppointmentsView from './views/AppointmentsView'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <MyNavBar />
      <Routes>
        <Route path="/" element={<PatientsView />} />
        <Route path="/turnos" element={<AppointmentsView />} />
      </Routes>
    </div>
  )
}

export default App