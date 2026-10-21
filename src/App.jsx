import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route, Outlet } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import 'bootstrap/dist/css/bootstrap.min.css'

// Las pantallas del doctor comparten la navbar; la del paciente tiene la suya
function DoctorLayout() {
  return (
    <>
      <MyNavBar />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Routes>
        <Route element={<DoctorLayout />}>
          <Route path="/" element={<PatientsView />} />
          <Route path="/turnos" element={<AppointmentsView />} />
        </Route>
        <Route path="/mi-ficha" element={<PatientHomeView />} />
      </Routes>
    </div>
  )
}

export default App
