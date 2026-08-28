import { apiFetch } from './apiClient'

export async function getConsultationsByPatientId(patientId) {
  return apiFetch(`/consultation/patient/${patientId}`)
}

export async function createConsultation(patientId, data) {
  return apiFetch(`/Consultation/patient/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateConsultation(id, data) {
  return apiFetch(`/consultation/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteConsultation(id) {
  return apiFetch(`/consultation/${id}`, { method: 'DELETE' })
}