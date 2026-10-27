import TopBar from './components/topBar/TopBar'
import { Routes, Route, Outlet, useMatch } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
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

// Pantallas del doctor: TopBar + alto fijo (el doctor scrollea por columna: calendario, historial)
// En /turnos el header muestra "← Mis pacientes" en lugar de la marca
const BACK_TO_PATIENTS = { to: '/', label: 'Mis pacientes' }

function DoctorLayout() {
  const { user } = useAuth()
  const onAppointments = useMatch('/turnos')
  return (
    <div style={fullHeightStyle}>
      <TopBar
        name={user?.name}
        logoutPath="/staff/login"
        homePath="/"
        fullWidth
        backTo={onAppointments ? BACK_TO_PATIENTS : undefined}
      />
      <Outlet />
    </div>
  )
}

// Login y registro: sin TopBar, con el mismo contenedor de alto fijo
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
      {/* Vistas del doctor */}
      <Route element={<DoctorLayout />}>
        <Route path="/" element={<PatientsView />} />
        <Route path="/turnos" element={<AppointmentsView />} />
      </Route>

      {/* Vistas de autenticación (sin TopBar) */}
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