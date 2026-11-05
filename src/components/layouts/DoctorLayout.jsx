import { fullHeightStyle } from "./styles"
import { useAuth } from "../../hooks/useAuth"
import { useMatch } from "react-router-dom"
import { useState } from "react"
import TopBar from "../topBar/TopBar"
import { Outlet } from "react-router-dom"

const BACK_TO_PATIENTS = { to: '/', label: 'Mis pacientes' }


function DoctorLayout() {
  const { user } = useAuth()
  const onAppointments = useMatch('/turnos')
  
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  return (
    <div style={fullHeightStyle}>
      <TopBar
        name={user?.name}
        logoutPath="/staff/login"
        homePath="/"
        fullWidth
        backTo={onAppointments ? BACK_TO_PATIENTS : undefined}
      />
      <Outlet context={{ selectedPatientId, setSelectedPatientId }} />
    </div>
  )
}

export default DoctorLayout;