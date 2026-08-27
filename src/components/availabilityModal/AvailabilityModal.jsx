import { useState, useMemo } from 'react'
import { createAvailability, deleteAvailability } from '../../services/availabilityService'
import { timeToMinutes, minutesToTime } from '../../utils/dateUtils'
import styles from './AvailabilityModal.module.css'

// dayOfWeek según el contrato de la API: 0 = domingo ... 6 = sábado.
const DAYS = [
  { value: 1, label: 'LUN' },
  { value: 2, label: 'MAR' },
  { value: 3, label: 'MIE' },
  { value: 4, label: 'JUE' },
  { value: 5, label: 'VIE' },
  { value: 6, label: 'SAB' },
  { value: 0, label: 'DOM' },
]

const APPOINTMENT_DURATION = 30 // minutos. Fijo por ahora.

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => minutesToTime(i * 30))

function generateSlots(startTime, endTime) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const slots = []

  for (let minute = start; minute + APPOINTMENT_DURATION <= end; minute += APPOINTMENT_DURATION) {
    slots.push({
      startTime: minutesToTime(minute),
      endTime: minutesToTime(minute + APPOINTMENT_DURATION),
      enabled: true,
    })
  }

  return slots
}

// Agrupa turnos habilitados consecutivos en rangos contiguos.
// Esto existe porque el backend solo modela un rango por registro: si el
// médico saca un turno del medio (un break), hay que partir en 2 POSTs.
function slotsToRanges(slots) {
  const ranges = []
  let current = null

  for (const slot of slots) {
    if (!slot.enabled) {
      if (current) {
        ranges.push(current)
        current = null
      }
      continue
    }
    if (!current) {
      current = { startTime: slot.startTime, endTime: slot.endTime }
    } else {
      current.endTime = slot.endTime
    }
  }
  if (current) ranges.push(current)

  return ranges
}

function AvailabilityModal({ onClose, onSaved, existingAvailabilities = [] }) {
  const [selectedDays, setSelectedDays] = useState([]) // array de dayOfWeek (números)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [fineTune, setFineTune] = useState(false)
  const [slots, setSlots] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isRangeValid =
    startTime &&
    endTime &&
    timeToMinutes(endTime) - timeToMinutes(startTime) >= APPOINTMENT_DURATION

  // Recalcula los slots "posibles" cada vez que cambia el rango.
  const currentSlots = useMemo(() => {
    if (!isRangeValid) return []
    return generateSlots(startTime, endTime)
  }, [startTime, endTime, isRangeValid])

  function toggleDay(dayValue) {
    setSelectedDays((prev) => {
      const isSelecting = !prev.includes(dayValue)
      const next = isSelecting
        ? [...prev, dayValue]
        : prev.filter((d) => d !== dayValue)

      // Si es el primer día que se selecciona (arranco de cero), cargamos
      // su configuración ya guardada, si tiene.
      if (isSelecting && prev.length === 0) {
        const existing = existingAvailabilities
          .filter((a) => a.dayOfWeek === dayValue)
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

        if (existing.length > 0) {
          const rangeStart = existing[0].startTime
          const rangeEnd = existing[existing.length - 1].endTime
          setStartTime(rangeStart)
          setEndTime(rangeEnd)

          const fullSlots = generateSlots(rangeStart, rangeEnd)
          const markedSlots = fullSlots.map((slot) => {
            const covered = existing.some(
              (a) =>
                timeToMinutes(slot.startTime) >= timeToMinutes(a.startTime) &&
                timeToMinutes(slot.endTime) <= timeToMinutes(a.endTime)
            )
            return { ...slot, enabled: covered }
          })

          const hasGaps = markedSlots.some((s) => !s.enabled)
          setSlots(markedSlots)
          setFineTune(hasGaps) // solo mostramos el detalle si hay breaks guardados
        } else {
          setStartTime('')
          setEndTime('')
          setFineTune(false)
          setSlots([])
        }
      }

      // Si se deselecciona el último día, limpiamos el rango.
      if (!isSelecting && next.length === 0) {
        setStartTime('')
        setEndTime('')
        setFineTune(false)
        setSlots([])
      }

      return next
    })
  }

  function handleTimeChange(setter, value) {
    setter(value)
    setFineTune(false)
    setSlots([])
  }

  function handleFineTuneToggle(checked) {
    setFineTune(checked)
    if (checked && slots.length === 0) {
      setSlots(currentSlots)
    }
  }

  function toggleSlot(index) {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    )
  }

  async function handleFormatDay() {
    if (selectedDays.length === 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      // Borra del backend todas las franjas existentes de los días
      // seleccionados, dejándolos sin configuración.
      for (const dayOfWeek of selectedDays) {
        const existing = existingAvailabilities.filter((a) => a.dayOfWeek === dayOfWeek)
        for (const a of existing) {
          await deleteAvailability(a.id)
        }
      }

      setSelectedDays([])
      setStartTime('')
      setEndTime('')
      setFineTune(false)
      setSlots([])
      onSaved()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirm() {
    if (selectedDays.length === 0 || !isRangeValid) return

    const ranges = fineTune ? slotsToRanges(slots) : [{ startTime, endTime }]
    if (ranges.length === 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      for (const dayOfWeek of selectedDays) {
        // Si el día ya tenía configuración guardada, la reemplazamos entera
        // en vez de sumar rangos nuevos encima — si no, quedan rangos
        // superpuestos y slots duplicados en la grilla.
        const existing = existingAvailabilities.filter((a) => a.dayOfWeek === dayOfWeek)
        for (const a of existing) {
          await deleteAvailability(a.id)
        }

        for (const range of ranges) {
          await createAvailability({
            dayOfWeek,
            startTime: range.startTime,
            endTime: range.endTime,
            appointmentDuration: APPOINTMENT_DURATION,
          })
        }
      }
      onSaved()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const activeSlots = fineTune ? slots : currentSlots

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Configurar disponibilidad</h2>

        <label className={styles.label}>Seleccionar día/s</label>
        <div className={styles.dayRow}>
          {DAYS.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`${styles.dayChip} ${
                selectedDays.includes(d.value) ? styles.dayChipOn : ''
              }`}
              onClick={() => toggleDay(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className={styles.timeRow}>
          <div>
            <label className={styles.label}>Desde (Hr)</label>
            <select
              className={styles.select}
              value={startTime}
              onChange={(e) => handleTimeChange(setStartTime, e.target.value)}
            >
              <option value="">Seleccionar hr</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Hasta (Hr)</label>
            <select
              className={styles.select}
              value={endTime}
              onChange={(e) => handleTimeChange(setEndTime, e.target.value)}
            >
              <option value="">Seleccionar hr</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {isRangeValid && (
          <>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={fineTune}
                onChange={(e) => handleFineTuneToggle(e.target.checked)}
              />
              Alternar turnos ({currentSlots.length} turnos posibles)
            </label>

            <div
              className={`${styles.slotGridWrapper} ${
                fineTune ? styles.slotGridWrapperOpen : ''
              }`}
            >
              <div className={styles.slotGridInner}>
                <div className={styles.slotGrid}>
                  {activeSlots.map((slot, i) => (
                    <button
                      key={slot.startTime}
                      type="button"
                      className={`${styles.slotChip} ${
                        slot.enabled ? styles.slotChipOn : styles.slotChipOff
                      }`}
                      onClick={() => toggleSlot(i)}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {submitError && <p className={styles.error}>{submitError}</p>}

        <div className={styles.actions}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.dangerBtn}
            onClick={handleFormatDay}
            disabled={submitting || selectedDays.length === 0}
          >
            Formatear día
          </button>
          <button
            className={styles.primaryBtn}
            onClick={handleConfirm}
            disabled={submitting || selectedDays.length === 0 || !isRangeValid}
          >
            {submitting ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityModal
