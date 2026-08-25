import { apiFetch } from './apiClient'
import { toDateKey } from '../utils/dateUtils'

export async function getAppointmentsByWeek(from, to) {
  const fromKey = toDateKey(from)
  const toKey = toDateKey(to)
  return apiFetch(`/appointment?from=${fromKey}&to=${toKey}`)
}

export async function createAppointment(appointment) {
  return apiFetch('/appointment', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}

export async function updateAppointment(id, changes) {
  return apiFetch(`/appointment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  })
}

export async function cancelAppointment(id) {
  return apiFetch(`/appointment/${id}/cancel`, {
    method: 'PUT',
  })
}