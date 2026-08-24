import { startOfWeek, addDays, addWeeks, format, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

// La semana arranca el lunes (en date-fns: 0 = domingo, 1 = lunes)
export const WEEK_STARTS_ON = 1

/** Devuelve los 7 días de la semana que contiene a referenceDate, de lunes a domingo. */
export function getWeekDays(referenceDate) {
  const monday = startOfWeek(referenceDate, { weekStartsOn: WEEK_STARTS_ON })
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/** Suma (o resta, con números negativos) semanas a una fecha. */
export function shiftWeeks(date, amount) {
  return addWeeks(date, amount)
}

/** "18 - 24 de agosto de 2026" — para el encabezado del calendario. */
export function formatWeekRange(referenceDate) {
  const days = getWeekDays(referenceDate)
  const first = days[0]
  const last = days[6]

  const sameMonth = first.getMonth() === last.getMonth()
  const left = sameMonth
    ? format(first, 'd', { locale: es })
    : format(first, "d 'de' MMMM", { locale: es })

  return `${left} - ${format(last, "d 'de' MMMM 'de' yyyy", { locale: es })}`
}

/** "lun" — nombre corto del día. */
export function formatDayName(date) {
  return format(date, 'EEE', { locale: es })
}

/** "18" — número del día. */
export function formatDayNumber(date) {
  return format(date, 'd', { locale: es })
}

/** "2026-08-18" — clave estable para usar en objetos y como key de React. */
export function toDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Convierte "09:30" a minutos desde medianoche (570).
 * Nos sirve para poder hacer cuentas con horarios sin pelearnos con objetos Date.
 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/** La inversa: 570 -> "09:30". Siempre con dos dígitos. */
export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export { isSameDay, isToday }
