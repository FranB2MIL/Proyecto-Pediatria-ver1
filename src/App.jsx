import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route, Outlet } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import PatientBookingView from './pages/PatientBookingView'
import 'bootstrap/dist/css/bootstrap.min.css'

// Las pantallas del doctor comparten la navbar; la del paciente tiene la suya.
// El alto fijo vive acá y no en App: el doctor scrollea por columna (calendario,
// historial), mientras que la vista del paciente scrollea la página completa.
function DoctorLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <MyNavBar />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<DoctorLayout />}>
        <Route path="/" element={<PatientsView />} />
        <Route path="/turnos" element={<AppointmentsView />} />
      </Route>
      <Route path="/mi-ficha" element={<PatientHomeView />} />
      <Route path="/mi-ficha/turnos" element={<PatientBookingView />} />
    </Routes>
  )
}

export default App
