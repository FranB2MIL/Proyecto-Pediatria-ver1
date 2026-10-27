import { apiFetch } from './apiClient'; 


export async function getAdminPatients() {
  return await apiFetch('/admin/patients');
}


export async function assignPatientToDoctor(doctorId, patientId) {
  return await apiFetch(`/admin/doctors/${doctorId}/patients/${patientId}`, {
    method: 'POST',
  });
}


export async function removePatientFromDoctor(doctorId, patientId) {
  return await apiFetch(`/admin/doctors/${doctorId}/patients/${patientId}`, {
    method: 'DELETE',
  });
}