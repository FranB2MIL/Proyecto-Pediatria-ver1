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

// Copia del perfil a nivel de módulo: los cambios de updateMyProfile sobreviven
// mientras dure la sesión (hasta recargar), sin mutar la constante del mock.
let currentProfile = { ...MOCK_PATIENT_PROFILE }

export async function getMyProfile() {
  await delay(200)
  return { ...currentProfile }
}

// Al conectar: updateMyProfile(data) -> apiFetch('/patient/me', { method: 'PUT', body: JSON.stringify(data) })
// Ojo con dos cosas del back:
//  - DNI y email son únicos: si ya existen devuelve 409. Habrá que mostrar el
//    conflicto en el campo correspondiente del form, no solo como error general.
//  - El email es el usuario de login: si cambia, el token actual puede quedar
//    desactualizado y hacer falta uno nuevo (re-login o que el PUT devuelva token).
export async function updateMyProfile(data) {
  await delay(200)
  currentProfile = { ...currentProfile, ...data }
  return { ...currentProfile }
}

export async function getMyConsultations() {
  await delay(200)
  return MOCK_PATIENT_CONSULTATIONS.map((c) => ({ ...c }))
}

export async function getMyAppointments() {
  await delay(200)
  return MOCK_PATIENT_APPOINTMENTS.map((a) => ({ ...a }))
}
