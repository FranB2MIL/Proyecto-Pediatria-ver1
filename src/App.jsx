import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route, Outlet } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import PatientBookingView from './pages/PatientBookingView'
import LoginView from './pages/LoginView'
import RegisterView from './pages/RegisterView'
import LoginStaffView from './pages/LoginStaffView'
import AdminView from './pages/AdminView'
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

// Login y registro: sin navbar, con el mismo contenedor de alto fijo
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
      {/* Vistas con Navbar de Doctor */}
      <Route element={<DoctorLayout />}>
        <Route path="/" element={<PatientsView />} />
        <Route path="/turnos" element={<AppointmentsView />} />
      </Route>

      {/* Vistas de autenticación (sin Navbar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/staff/login" element={<LoginStaffView />} />
      </Route>

      {/* Vista de Administrador */}
      <Route path="/admin" element={<AdminView />} />

      {/* Vistas del paciente */}
      <Route path="/mi-ficha" element={<PatientHomeView />} />
      <Route path="/mi-ficha/turnos" element={<PatientBookingView />} />
    </Routes>
  )
}

export default App