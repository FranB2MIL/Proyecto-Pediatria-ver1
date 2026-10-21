// Mock de lo que ve el paciente logueado en su propia ficha.
// El backend todavía no expone endpoints para el rol Patient (todos los
// controllers piden Roles = Doctor), así que la vista arranca contra estos datos.
//
// profile refleja la entidad Patient (incluye InsuranceNumber, Email y PhoneNumber,
// que PatientDto todavía no expone).
// consultations refleja ConsultationDto + MeasurementDto.
// appointments refleja AppointmentDto. doctorName NO existe en el backend: lo
// agregamos porque al paciente le interesa con quién es el turno.

import { APPOINTMENT_STATUS } from './mockAppointments'

// Fechas relativas a hoy, en hora LOCAL (ver el comentario de mockAppointments.js)
const isoDate = (offsetDays) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export const MOCK_PATIENT_PROFILE = {
  id: 1,
  firstName: 'María',
  lastName: 'López',
  dateOfBirth: '2020-03-14T00:00:00',
  dni: '55123456',
  healthInsurance: 'OSDE',
  insuranceNumber: '61 234567 8 01',
  email: 'familia.lopez@mail.com',
  phoneNumber: '11 5555-1234',
}

export const MOCK_PATIENT_CONSULTATIONS = [
  {
    id: 1, patientId: 1, date: `${isoDate(-200)}T00:00:00`,
    reason: 'Control de rutina', description: 'Buen desarrollo general. Vacunas al día.',
    measurement: { weight: 17.2, height: 1.04, size: 1.04, imc: 15.9 },
  },
  {
    id: 2, patientId: 1, date: `${isoDate(-120)}T00:00:00`,
    reason: 'Fiebre y tos', description: 'Cuadro viral. Reposo, hidratación y control en 48 h.',
    measurement: { weight: 17.6, height: 1.06, size: 1.06, imc: 15.66 },
  },
  {
    id: 3, patientId: 1, date: `${isoDate(-30)}T00:00:00`,
    reason: 'Control de rutina', description: 'Peso y talla dentro de lo esperado.',
    measurement: { weight: 18.4, height: 1.09, size: 1.09, imc: 15.49 },
  },
]

export const MOCK_PATIENT_APPOINTMENTS = [
  { id: 10, doctorId: 1, doctorName: 'Dra. Laura Fernández', patientId: 1, availabilityId: 1, date: isoDate(-30), startTime: '09:00', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 11, doctorId: 1, doctorName: 'Dra. Laura Fernández', patientId: 1, availabilityId: 1, date: isoDate(3),   startTime: '10:30', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 12, doctorId: 1, doctorName: 'Dra. Laura Fernández', patientId: 1, availabilityId: 2, date: isoDate(10),  startTime: '15:00', status: APPOINTMENT_STATUS.CANCELADO },
  { id: 13, doctorId: 1, doctorName: 'Dra. Laura Fernández', patientId: 1, availabilityId: 1, date: isoDate(24),  startTime: '09:30', status: APPOINTMENT_STATUS.RESERVADO },
]
