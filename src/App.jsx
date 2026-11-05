import { Routes, Route } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import PatientBookingView from './pages/PatientBookingView'
import LoginView from './pages/LoginView'
import RegisterView from './pages/RegisterView'
import LoginStaffView from './pages/LoginStaffView'
import AdminView from './pages/AdminView'
import DoctorLayout from './components/layouts/DoctorLayout'
import AuthLayout from './components/layouts/AuthLayout'
import RequireAuth from './components/RequireAuth'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Routes>
      {/* Vistas de autenticación (sin TopBar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/staff/login" element={<LoginStaffView />} />
      </Route>

      {/* Todo lo de acá abajo requiere sesión */}
      <Route element={<RequireAuth />}>
        {/* Vistas del doctor */}
        <Route element={<DoctorLayout />}>
          <Route path="/" element={<PatientsView />} />
          <Route path="/turnos" element={<AppointmentsView />} />
        </Route>

        {/* Vista de Administrador */}
        <Route path="/admin" element={<AdminView />} />

        {/* Vistas del paciente */}
        <Route path="/mi-ficha" element={<PatientHomeView />} />
        <Route path="/mi-ficha/turnos" element={<PatientBookingView />} />
      </Route>
    </Routes>
  )
}

export default App