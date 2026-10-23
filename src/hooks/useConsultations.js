import { useState, useEffect } from 'react'
import { toApiMeasurement } from '../utils/measurement'
import {
  getConsultationsByPatientId,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from '../services/consultationService'

const toPayload = (formData) => ({
  date: formData.date,
  reason: formData.reason.trim(),
  description: formData.description.trim(),
  measurement: toApiMeasurement(formData.measurement),
})

export function useConsultations(patientId) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!patientId) {
      setConsultations([])
      return
    }

    let ignore = false
    setLoading(true)
    setError(null)

    getConsultationsByPatientId(patientId)
      .then((data) => { if (!ignore) setConsultations(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [patientId])

  const addConsultation = async (formData) => {
    const created = await createConsultation(patientId, toPayload(formData))
    setConsultations((prev) => [...prev, created])
  }

  const editConsultation = async (id, formData) => {
    const updated = await updateConsultation(id, toPayload(formData))
    setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  const removeConsultation = async (id) => {
    await deleteConsultation(id)
    setConsultations((prev) => prev.filter((c) => c.id !== id))
  }

  const sorted = consultations
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return { consultations: sorted, loading, error, addConsultation, editConsultation, removeConsultation }
}