import { apiFetch } from './apiClient';

export async function getAllDoctors() {
  return apiFetch('/Doctor');
}


export const createDoctor = async (doctorData) => {
  return await apiFetch('/Doctor', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  })
}

export const updateDoctor = async (id, doctorData) => {
  return await apiFetch(`/Doctor/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData)
  })
}