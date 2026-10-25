import { apiFetch } from './apiClient'

export async function loginPatient(email, password) {
    return apiFetch('/auth/patient/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
    })
}

export async function registerPatient(formData) {
    return apiFetch('/auth/patient/register', {
        method: 'POST',
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            dni: formData.dni,
            healthInsurance: formData.healthInsurance,
            insuranceNumber: formData.insuranceNumber,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
        })
        })
    }




export async function loginStaff(email, password) {
    return apiFetch('/auth/staff/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
    })
}
       