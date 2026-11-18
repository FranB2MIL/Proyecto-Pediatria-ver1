import { Routes, Route, Navigate } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import PatientHomeView from './pages/PatientHomeView'
import PatientBookingView from './pages/PatientBookingView'
import LoginView from './pages/LoginView'
import RegisterView from './pages/RegisterView'
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
      </Route>

      {/* Ruta vieja: se mantiene por si alguien tiene el link guardado */}
      <Route path="/staff/login" element={<Navigate to="/login" replace />} />

      {/* Vistas del doctor */}
      <Route element={<RequireAuth allowedRoles={['Doctor']} />}>
        <Route element={<DoctorLayout />}>
          <Route path="/" element={<PatientsView />} />
          <Route path="/turnos" element={<AppointmentsView />} />
        </Route>
      </Route>

      {/* Vista de Administrador */}
      <Route element={<RequireAuth allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminView />} />
      </Route>

      {/* Vistas del paciente */}
      <Route element={<RequireAuth allowedRoles={['Patient']} />}>
        <Route path="/mi-ficha" element={<PatientHomeView />} />
        <Route path="/mi-ficha/turnos" element={<PatientBookingView />} />
      </Route>
    </Routes>
  )
}

export default App
