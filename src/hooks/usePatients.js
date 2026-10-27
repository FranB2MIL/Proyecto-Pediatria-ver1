import { useState, useEffect } from 'react'
import { getAllPatients } from '../services/patientService'

// Pacientes del doctor logueado.
// deletedPatientId: cuando cambia se saca ese paciente de la lista sin volver a pedirla.
export function usePatients(deletedPatientId) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPatients = async () => {
    try {
      setError(null)
      const data = await getAllPatients()
      setPatients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (deletedPatientId) {
      setPatients(prev => prev.filter(p => p.id !== deletedPatientId))
    }
  }, [deletedPatientId])

  return { patients, loading, error, reload: loadPatients }
}
