import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route, Outlet } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import PatientBookingView from './pages/PatientBookingView'
import LoginView from './pages/LoginView'
import RegisterView from './pages/RegisterView'
import 'bootstrap/dist/css/bootstrap.min.css'

const fullHeightStyle = { display: 'flex', flexDirection: 'column', height: '100vh' }

// Pantallas del doctor: navbar + alto fijo (el doctor scrollea por columna: calendario, historial)
function DoctorLayout() {
  return (
    <div style={fullHeightStyle}>
      <MyNavBar />
      <Outlet />
    </div>
  )
}

// Login y registro: sin navbar, con el mismo contenedor de alto fijo que tenían antes
function AuthLayout() {
  return (
    <div style={fullHeightStyle}>
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
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Route>
      {/* Vista del paciente: scrollea la página completa y tiene su propio header */}
      <Route path="/mi-ficha" element={<PatientHomeView />} />
      <Route path="/mi-ficha/turnos" element={<PatientBookingView />} />
    </Routes>
  )
}

export default App