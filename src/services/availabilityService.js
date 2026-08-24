import { MOCK_AVAILABILITY } from '../data/mockAvailability'

// Servicio MOCK. Las firmas son las mismas que va a tener la versión real,
// así cuando el backend exponga /api/availability solo cambiamos el cuerpo
// de estas funciones y ningún componente se entera.

const FAKE_DELAY = 200

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let availabilities = [...MOCK_AVAILABILITY]

export async function getAvailabilities(doctorId) {
  await delay(FAKE_DELAY)
  return availabilities.filter((a) => a.doctorId === doctorId)
}

export async function createAvailability(availability) {
  await delay(FAKE_DELAY)
  const nextId = Math.max(0, ...availabilities.map((a) => a.id)) + 1
  const created = { ...availability, id: nextId }
  availabilities = [...availabilities, created]
  return created
}

export async function deleteAvailability(id) {
  await delay(FAKE_DELAY)
  availabilities = availabilities.filter((a) => a.id !== id)
}
