// Datos del paciente logueado (rol Patient).
// MOCK: el backend todavía no tiene estos endpoints. Las firmas ya son las
// definitivas; al conectar, cada cuerpo pasa a ser un apiFetch, por ejemplo:
//   getMyProfile()       -> apiFetch('/patient/me')
//   getMyConsultations() -> apiFetch('/patient/me/consultations')
//   getMyAppointments()  -> apiFetch('/patient/me/appointments')
// El paciente sale del JWT, igual que el doctorId en los endpoints del doctor.
import {
  MOCK_PATIENT_PROFILE,
  MOCK_PATIENT_CONSULTATIONS,
  MOCK_PATIENT_APPOINTMENTS,
} from '../data/mockPatientPortal'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMyProfile() {
  await delay(200)
  return { ...MOCK_PATIENT_PROFILE }
}

export async function getMyConsultations() {
  await delay(200)
  return MOCK_PATIENT_CONSULTATIONS.map((c) => ({ ...c }))
}

export async function getMyAppointments() {
  await delay(200)
  return MOCK_PATIENT_APPOINTMENTS.map((a) => ({ ...a }))
}
