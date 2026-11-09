

import { APPOINTMENT_STATUS } from '../constants/appointmentStatus'

export { APPOINTMENT_STATUS } from '../constants/appointmentStatus'

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

const isoDate = (offsetDays) => {
  const d = new Date(monday)
  d.setDate(monday.getDate() + offsetDays)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export const MOCK_APPOINTMENTS = [
  { id: 1, doctorId: 1, patientId: 1, patientName: 'María López',    availabilityId: 1, date: isoDate(0), startTime: '09:00', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 2, doctorId: 1, patientId: 2, patientName: 'Carlos Ramírez', availabilityId: 1, date: isoDate(0), startTime: '10:30', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 3, doctorId: 1, patientId: 3, patientName: 'Ana García',     availabilityId: 2, date: isoDate(0), startTime: '15:00', status: APPOINTMENT_STATUS.CANCELADO },
  { id: 4, doctorId: 1, patientId: 4, patientName: 'Jorge Pérez',    availabilityId: 3, date: isoDate(1), startTime: '09:20', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 5, doctorId: 1, patientId: 1, patientName: 'María López',    availabilityId: 4, date: isoDate(2), startTime: '14:30', status: APPOINTMENT_STATUS.RESERVADO },
  { id: 6, doctorId: 1, patientId: 5, patientName: 'Fran Pérez',     availabilityId: 6, date: isoDate(4), startTime: '11:00', status: APPOINTMENT_STATUS.RESERVADO },
]
