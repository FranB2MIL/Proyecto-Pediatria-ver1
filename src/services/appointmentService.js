import { MOCK_APPOINTMENTS, APPOINTMENT_STATUS } from '../data/mockAppointments'
import { toDateKey } from '../utils/dateUtils'

// Servicio MOCK, mismo criterio que availabilityService:
// firmas estables, cuerpo reemplazable cuando exista /api/appointment.

const FAKE_DELAY = 200

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let appointments = [...MOCK_APPOINTMENTS]

export async function getAppointmentsByWeek(doctorId, from, to) {
  await delay(FAKE_DELAY)
  const fromKey = toDateKey(from)
  const toKey = toDateKey(to)

  // Las fechas son strings 'yyyy-MM-dd', así que comparar con <= alfabéticamente
  // funciona igual que comparar cronológicamente. Es el truco del formato ISO.
  return appointments.filter(
    (a) => a.doctorId === doctorId && a.date >= fromKey && a.date <= toKey
  )
}

export async function createAppointment(appointment) {
  await delay(FAKE_DELAY)
  const nextId = Math.max(0, ...appointments.map((a) => a.id)) + 1
  const created = {
    ...appointment,
    id: nextId,
    status: APPOINTMENT_STATUS.RESERVADO,
  }
  appointments = [...appointments, created]
  return created
}

export async function updateAppointment(id, changes) {
  await delay(FAKE_DELAY)
  appointments = appointments.map((a) => (a.id === id ? { ...a, ...changes } : a))
  return appointments.find((a) => a.id === id)
}

export async function cancelAppointment(id) {
  return updateAppointment(id, { status: APPOINTMENT_STATUS.CANCELADO })
}
