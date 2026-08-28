import { apiFetch } from './apiClient'

function toPatientDto(formData) {
  return {
    FirstName: formData.firstName,
    LastName: formData.lastName,
    DateOfBirth: formData.dateOfBirth,
    DNI: formData.dni,
    HealthInsurance: formData.healthInsurance,
  }
}

export async function getAllPatients() {
  return apiFetch('/patient')
}

export async function createPatient(formData) {
  return apiFetch('/patient', {
    method: 'POST',
    body: JSON.stringify(toPatientDto(formData)),
  })
}

export async function updatePatient(id, formData) {
  return apiFetch(`/patient/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toPatientDto(formData)),
  })
}