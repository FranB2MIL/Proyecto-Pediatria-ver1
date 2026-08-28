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