// Datos personales que comparten el registro de paciente y el alta de médico
export const PERSONAL_FIELDS = [
    { key: 'dni', label: 'DNI', type: 'text' },
    { key: 'dateOfBirth', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'healthInsurance', label: 'Obra social (opcional)', type: 'text' },
    { key: 'insuranceNumber', label: 'N° de afiliado (opcional)', type: 'text' },
    { key: 'phoneNumber', label: 'Teléfono', type: 'tel' },
]

export const initialAccountForm = {
    firstName: '',
    lastName: '',
    dni: '',
    dateOfBirth: '',
    healthInsurance: '',
    insuranceNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
}

export const initialRegisterForm = {
    ...initialAccountForm,
    confirmPassword: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAccountForm(formData) {
    const errors = {}

    if (!formData.firstName.trim()) errors.firstName = 'Ingresá el nombre.'
    if (!formData.lastName.trim()) errors.lastName = 'Ingresá el apellido.'
    if (!/^\d{7,8}$/.test(formData.dni)) errors.dni = 'El DNI debe tener 7 u 8 números.'
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Ingresá la fecha de nacimiento.'
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Ingresá un teléfono.'
    if (!EMAIL_REGEX.test(formData.email)) errors.email = 'Ingresá un email válido.'
    if (formData.password.length < 6) errors.password = 'Mínimo 6 caracteres.'

    return errors
}

export function validateRegisterForm(formData) {
    const errors = validateAccountForm(formData)

    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Las contraseñas no coinciden.'

    return errors
}
