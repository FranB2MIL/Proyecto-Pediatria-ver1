import { parseLocalDate, toDateKey } from '../utils/dateUtils'

// Dígitos con espacios, guiones, paréntesis y un + opcional al principio: "11 5555-1234", "+54 9 11 ..."
const PHONE_REGEX = /^\+?[\d\s()-]+$/

/** Saca puntos y espacios: "43.127.649" -> "43127649" (mismo formato que guarda el resto de la app). */
export const normalizeDni = (dni) => String(dni ?? '').replace(/[.\s]/g, '')

/** Perfil del paciente -> valores del form (el input date espera yyyy-MM-dd). */
export const toProfileForm = (profile) => ({
  firstName: profile.firstName ?? '',
  lastName: profile.lastName ?? '',
  dni: profile.dni ?? '',
  dateOfBirth: String(profile.dateOfBirth ?? '').slice(0, 10),
  healthInsurance: profile.healthInsurance ?? '',
  insuranceNumber: profile.insuranceNumber ?? '',
  email: profile.email ?? '',
  phoneNumber: profile.phoneNumber ?? '',
})

/** Devuelve { campo: mensaje } solo con los campos inválidos; vacío si está todo bien. */
export const validateProfileForm = (form) => {
  const errors = {}

  if (!form.firstName.trim()) errors.firstName = 'Ingresá el nombre.'
  if (!form.lastName.trim()) errors.lastName = 'Ingresá el apellido.'

  const birth = parseLocalDate(form.dateOfBirth)
  if (!form.dateOfBirth) errors.dateOfBirth = 'Ingresá la fecha de nacimiento.'
  else if (!birth || birth.getFullYear() < 1900) errors.dateOfBirth = 'La fecha de nacimiento no es válida.'
  else if (form.dateOfBirth > toDateKey(new Date())) errors.dateOfBirth = 'La fecha de nacimiento no puede ser futura.'

  // Obligatorio porque el back lo pide así en RegisterPatientDto
  const phone = form.phoneNumber.trim()
  const phoneDigits = phone.replace(/\D/g, '')
  if (!phone) errors.phoneNumber = 'Ingresá el teléfono.'
  else if (!PHONE_REGEX.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phoneNumber = 'El teléfono no tiene un formato válido (ej.: 11 5555-1234).'
  }

  return errors
}

/** Valores del form -> body del PUT /me/profile. DNI y email no se envían: el back no los edita. */
export const toProfilePayload = (form) => ({
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  dateOfBirth: `${form.dateOfBirth}T00:00:00`,
  healthInsurance: form.healthInsurance.trim(),
  insuranceNumber: form.insuranceNumber.trim(),
  phoneNumber: form.phoneNumber.trim(),
})
