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

export async function getAvailablePatients(){
  return apiFetch('/patient/available')
}

export async function linkPatient(id){
  return apiFetch(`/patient/${id}/link`, { method: 'POST'})
}

export async function unlinkPatient(id){
  return apiFetch(`/patient/${id}/link`, { method: 'DELETE'})
}
