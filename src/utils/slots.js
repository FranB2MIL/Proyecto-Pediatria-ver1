import { timeToMinutes, minutesToTime, toDateKey } from './dateUtils'
import { APPOINTMENT_STATUS } from '../data/mockAppointments'

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
