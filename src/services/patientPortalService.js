// Datos del paciente logueado (rol Patient). El paciente sale del JWT.
// Un doctor que llame a estos endpoints recibe 403 (error.status).
import { apiFetch } from './apiClient'

// El back manda nombre y apellido por separado; los componentes leen doctorName
const withDoctorName = (item) => ({
  ...item,
  doctorName: [item.doctorFirstName, item.doctorLastName].filter(Boolean).join(' '),
})

export async function getMyProfile() {
  return apiFetch('/me/profile')
}

// Devuelve el perfil actualizado. DNI y email no se envían: el back no los edita.
export async function updateMyProfile(data) {
  return apiFetch('/me/profile', { method: 'PUT', body: JSON.stringify(data) })
}

export async function getMyConsultations() {
  const consultations = await apiFetch('/me/consultations')
  return consultations.map(withDoctorName)
}

// El back todavía no manda la especialidad; si llega (specialty o especialidad) queda en `specialty`
const withSpecialty = (doctor) => ({
  ...doctor,
  specialty: String(doctor.specialty ?? doctor.especialidad ?? '').trim(),
})

export async function getMyDoctors() {
  const doctors = await apiFetch('/me/doctors')
  return doctors.map(withSpecialty)
}

export async function getMyAppointments() {
  const appointments = await apiFetch('/me/appointments')
  return appointments.map(withDoctorName)
}

// Solo horarios libres dentro de la disponibilidad. Máx 31 días entre from y to (yyyy-MM-dd)
export async function getAvailableSlots(doctorId, from, to) {
  return apiFetch(`/me/doctors/${doctorId}/available-slots?from=${from}&to=${to}`)
}

export async function bookAppointment({ doctorId, date, startTime }) {
  return apiFetch('/me/appointments', {
    method: 'POST',
    body: JSON.stringify({ doctorId, date, startTime }),
  })
}

export async function cancelMyAppointment(id) {
  return apiFetch(`/me/appointments/${id}/cancel`, { method: 'PUT' })
}
