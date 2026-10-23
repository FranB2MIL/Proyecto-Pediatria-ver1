export const initialRegisterForm = {
    firstName: '',
    lastName: '',
    dni: '',
    dateOfBirth: '',
    healthInsurance: '',
    insuranceNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegisterForm(formData) {
    const errors = {}

    if (!formData.firstName.trim()) errors.firstName = 'Ingresá el nombre.'
  if (!formData.lastName.trim()) errors.lastName = 'Ingresá el apellido.'
  if (!/^\d{7,8}$/.test(formData.dni)) errors.dni = 'El DNI debe tener 7 u 8 números.'
  if (!formData.dateOfBirth) errors.dateOfBirth = 'Ingresá la fecha de nacimiento.'
  if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Ingresá un teléfono.'
  if (!EMAIL_REGEX.test(formData.email)) errors.email = 'Ingresá un email válido.'
  if (formData.password.length < 6) errors.password = 'Mínimo 6 caracteres.'
  if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Las contraseñas no coinciden.'

  return errors
}
