import { APPOINTMENT_STATUS } from '../constants/appointmentStatus'
import { toDateKey } from './dateUtils'

// Cantidad de turnos activos que se muestran en la tarjeta antes de "Ver todos"
export const MAX_VISIBLE_APPOINTMENTS = 5

// Ventana (en días desde hoy) que trae el panel del doctor; el back exige from/to
export const UPCOMING_DAYS = 30

const pad = (n) => String(n).padStart(2, '0')

// Las fechas son strings yyyy-MM-dd y la hora "HH:mm", así que se comparan como texto.
// Se recortan por si el back manda "yyyy-MM-ddT00:00:00" o "HH:mm:ss".
const sortKey = (appointment) =>
  `${String(appointment.date).slice(0, 10)} ${String(appointment.startTime).slice(0, 5)}`

/**
 * Separa los turnos futuros en activos (Reservado) y cancelados.
 * Un turno de hoy cuya hora ya pasó no es próximo. Ambos grupos quedan
 * ordenados por fecha y hora ascendente.
 */
export function groupUpcomingAppointments(appointments, now = new Date()) {
  const nowKey = `${toDateKey(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  // Mismo criterio de fecha+hora para activos y cancelados
  const future = appointments
    .filter((a) => sortKey(a) >= nowKey)
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

  return {
    active: future.filter((a) => a.status === APPOINTMENT_STATUS.RESERVADO),
    cancelled: future.filter((a) => a.status === APPOINTMENT_STATUS.CANCELADO),
  }
}
