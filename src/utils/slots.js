import { timeToMinutes, minutesToTime, toDateKey } from './dateUtils'
import { APPOINTMENT_STATUS } from '../data/mockAppointments'

/**
 * ⭐ ESTA ES LA FUNCIÓN PRINCIPAL DEL CALENDARIO — la escribís vos.
 *
 * Recibe todas las disponibilidades del doctor y una fecha concreta, y devuelve
 * la lista de slots (huecos de turno) que existen ese día.
 *
 * Ejemplo: si el doctor atiende los lunes de 09:00 a 12:00 con turnos de 30 min,
 * para un lunes tenés que devolver 6 slots: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30.
 * Ojo: 12:00 NO va, porque ese turno terminaría a las 12:30 y ya está fuera de la franja.
 *
 * Forma de cada slot:
 *   { id: '2026-08-18T09:00', date: '2026-08-18', startTime: '09:00',
 *     endTime: '09:30', availabilityId: 1 }
 *
 * ── Cómo encararlo ──────────────────────────────────────────────────────────
 * 1. Averiguá qué día de la semana es `date` con date.getDay() (0=domingo, 1=lunes...).
 * 2. Filtrá `availabilities` para quedarte solo con las de ese día.
 *    Puede haber más de una: los lunes hay franja de mañana Y de tarde.
 * 3. Por cada franja, convertí startTime y endTime a minutos con timeToMinutes().
 * 4. Iterá desde el inicio hasta el fin, avanzando de a `appointmentDuration` minutos.
 *    Cortá cuando `minuto + duración > fin` para no pasarte de la franja.
 * 5. Por cada paso, armá el objeto slot usando minutesToTime() para volver a "HH:MM".
 * 6. Devolvé todos los slots de todas las franjas, ordenados por hora.
 *
 * Tip: `toDateKey(date)` te da el "2026-08-18" que necesitás para `date` y para el `id`.
 */
export function generateDaySlots(availabilities, date) {
  const dayOfWeek = date.getDay()
  const dateKey = toDateKey(date)

  const dayAvailabilities = availabilities.filter((a) => a.dayOfWeek === dayOfWeek)

  const slots = []

  for (const availability of dayAvailabilities) {
    const start = timeToMinutes(availability.startTime)
    const end = timeToMinutes(availability.endTime)
    const duration = availability.appointmentDuration

    for (let minute = start; minute + duration <= end; minute += duration) {
      const startTime = minutesToTime(minute)

      slots.push({
        id: `${dateKey}T${startTime}`,
        date: dateKey,
        startTime,
        endTime: minutesToTime(minute + duration),
        availabilityId: availability.id,
      })
    }
  }

  return slots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
}

/**
 * Toma los slots de un día y les "pega" el turno correspondiente, si existe.
 *
 * Esta te la dejo hecha para que tengas de referencia el estilo con el que
 * encarar la de arriba. Fijate que no muta nada: devuelve objetos nuevos.
 */
export function attachAppointments(slots, appointments) {
  return slots.map((slot) => {
    const appointment = appointments.find(
      (a) => a.date === slot.date && a.startTime === slot.startTime
    )

    return {
      ...slot,
      appointment: appointment ?? null,
      status: appointment ? appointment.status : APPOINTMENT_STATUS.DISPONIBLE,
    }
  })
}

/**
 * Arma el calendario completo de la semana.
 *
 * Devuelve un objeto indexado por fecha, listo para renderizar:
 *   { '2026-08-18': [slot, slot, ...], '2026-08-19': [...] }
 *
 * También te la dejo hecha: es solo pegamento entre las dos funciones anteriores.
 */
export function buildWeekSlots(weekDays, availabilities, appointments) {
  const result = {}

  for (const day of weekDays) {
    const key = toDateKey(day)
    const daySlots = generateDaySlots(availabilities, day)
    const dayAppointments = appointments.filter((a) => a.date === key)
    result[key] = attachAppointments(daySlots, dayAppointments)
  }

  return result
}
