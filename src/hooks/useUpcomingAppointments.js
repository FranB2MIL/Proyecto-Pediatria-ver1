import { useState, useEffect, useMemo } from 'react'
import { addDays } from 'date-fns'
import { getAppointmentsByWeek, cancelAppointment } from '../services/appointmentService'
import { APPOINTMENT_STATUS } from '../constants/appointmentStatus'
import { groupUpcomingAppointments, UPCOMING_DAYS } from '../utils/upcomingAppointments'

const fetchUpcoming = () => {
  const today = new Date()
  return getAppointmentsByWeek(today, addDays(today, UPCOMING_DAYS))
}

// Próximos turnos del doctor logueado (todos sus pacientes) + el flujo de cancelar.
// refreshKey: cuando cambia se vuelve a pedir la lista (ej. al borrar un paciente).
export function useUpcomingAppointments(refreshKey) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchUpcoming()
        if (!ignore) setAppointments(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [refreshKey])

  const { active, cancelled } = useMemo(
    () => groupUpcomingAppointments(appointments),
    [appointments],
  )

  const requestCancel = (appointment) => {
    setCancelError(null)
    setAppointmentToCancel(appointment)
  }

  const closeCancel = () => {
    setAppointmentToCancel(null)
    setCancelError(null)
  }

  // Si falla, el error queda en el modal sin cerrarlo
  const confirmCancel = async () => {
    setCancelling(true)
    setCancelError(null)
    try {
      await cancelAppointment(appointmentToCancel.id)
    } catch (err) {
      setCancelError(err.message)
      setCancelling(false)
      return
    }
    // El turno cambia de grupo al instante, sin pasar por "Cargando..."
    const cancelledId = appointmentToCancel.id
    setAppointments((prev) => prev.map((a) =>
      a.id === cancelledId ? { ...a, status: APPOINTMENT_STATUS.CANCELADO } : a
    ))
    setCancelling(false)
    closeCancel()
    // Refresco en segundo plano por si cambió algo más; si falla, la lista local ya es correcta
    fetchUpcoming().then(setAppointments).catch(() => {})
  }

  return {
    active, cancelled, loading, error,
    appointmentToCancel, cancelling, cancelError,
    requestCancel, closeCancel, confirmCancel,
  }
}
