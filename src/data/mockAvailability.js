// Mock de disponibilidad del doctor.
// Refleja la entidad Availability del backend (Domain/Entities/Availability.cs):
//   Id, DayOfWeek, StartTime, EndTime, AppointmentDuration, DoctorId
//
// dayOfWeek usa la misma numeración que .NET DayOfWeek y que Date.getDay() de JS:
//   0 = domingo, 1 = lunes, ... 6 = sábado
// appointmentDuration está en minutos.

export const MOCK_AVAILABILITY = [
  { id: 1, doctorId: 1, dayOfWeek: 1, startTime: '09:00', endTime: '12:00', appointmentDuration: 30 },
  { id: 2, doctorId: 1, dayOfWeek: 1, startTime: '15:00', endTime: '17:00', appointmentDuration: 30 },
  { id: 3, doctorId: 1, dayOfWeek: 2, startTime: '09:00', endTime: '13:00', appointmentDuration: 20 },
  { id: 4, doctorId: 1, dayOfWeek: 3, startTime: '14:00', endTime: '18:00', appointmentDuration: 30 },
  { id: 5, doctorId: 1, dayOfWeek: 4, startTime: '09:00', endTime: '12:00', appointmentDuration: 20 },
  { id: 6, doctorId: 1, dayOfWeek: 5, startTime: '10:00', endTime: '13:00', appointmentDuration: 30 },
]
