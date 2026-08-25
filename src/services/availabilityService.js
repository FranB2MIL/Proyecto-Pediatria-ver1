import { apiFetch } from './apiClient'

export async function getAvailabilities() {
  return apiFetch('/availability')
}

export async function createAvailability(availability) {
  return apiFetch('/availability', {
    method: 'POST',
    body: JSON.stringify(availability),
  })
}

export async function updateAvailability(id, changes) {
  return apiFetch(`/availability/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  })
}

export async function deleteAvailability(id) {
  return apiFetch(`/availability/${id}`, {
    method: 'DELETE',
  })
}