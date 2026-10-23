import MyNavBar from './components/myNavBar/MyNavBar'
import { Routes, Route, useLocation } from 'react-router-dom'
import PatientsView from './pages/PatientsView'
import AppointmentsView from './pages/AppointmentsView'
import LoginView from './pages/LoginView'
import RegisterView from './pages/RegisterView'
import 'bootstrap/dist/css/bootstrap.min.css'

const ROUTES_WITHOUT_NAVBAR = ['/login', '/register', '/paciente']

function App() {
  const location = useLocation()
  const showNavBar = !ROUTES_WITHOUT_NAVBAR.includes(location.pathname)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {showNavBar && <MyNavBar />}
      <Routes>
        <Route path="/" element={<PatientsView />} />
        <Route path="/turnos" element={<AppointmentsView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Routes>
    </div>
  )
}

export default App