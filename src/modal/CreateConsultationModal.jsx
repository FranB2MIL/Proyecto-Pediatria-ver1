import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { initialConsultationsForm, emptyMeasurement } from './createConsultationModalHelper.js'
import styles from './CreateConsultationModal.module.css'

// Fecha de hoy en formato YYYY-MM-DD, en hora local (no UTC).
const todayKey = () => {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const inRange = (value, min, max) => {
  const n = Number(value)
  return value !== '' && !Number.isNaN(n) && n >= min && n <= max
}

function validate(formData) {
  const errors = {}

  if (!formData.date) errors.date = 'Ingresá la fecha de la consulta.'
  else if (formData.date > todayKey()) errors.date = 'La fecha no puede ser futura.'

  if (!formData.reason.trim()) errors.reason = 'Ingresá el motivo de la consulta.'
  else if (formData.reason.trim().length > 200) errors.reason = 'El motivo no puede superar los 200 caracteres.'

  const m = formData.measurement
  if (m) {
    if (!inRange(m.weight, 0.3, 150)) errors.weight = 'El peso tiene que estar entre 0,3 y 150 kg.'
    if (!inRange(m.height, 30, 200)) errors.height = 'La talla tiene que estar entre 30 y 200 cm.'
    if (m.headCircumference !== '' && !inRange(m.headCircumference, 25, 65)) {
      errors.headCircumference = 'El perímetro cefálico tiene que estar entre 25 y 65 cm.'
    }
  }

  return errors
}

const CreateConsultationModal = ({ modalTitle, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || initialConsultationsForm)
  const [errors, setErrors] = useState({})

  const showMeasurements = formData.measurement !== null

  const handleInputChange = (event, inputKey) => {
    setFormData((prev) => ({ ...prev, [inputKey]: event.target.value }))
  }

  const handleMeasurementChange = (event, measurementKey) => {
    setFormData((prev) => ({
      ...prev,
      measurement: { ...prev.measurement, [measurementKey]: event.target.value },
    }))
  }

  const handleAddMeasurements = () => {
    setFormData((prev) => ({ ...prev, measurement: { ...emptyMeasurement } }))
  }

  const handleRemoveMeasurements = () => {
    setFormData((prev) => ({ ...prev, measurement: null }))
    setErrors(({ weight, height, headCircumference, ...rest }) => rest)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSave(formData)
  }

  const fieldProps = (key) => ({
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  const ErrorText = ({ name }) =>
    errors[name] ? <p id={`${name}-error`} className={styles.error}>{errors[name]}</p> : null

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} id="consultation-form" className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">Fecha</label>
            <input
              className={styles.input}
              id="date"
              type="date"
              max={todayKey()}
              value={formData.date}
              onChange={(e) => handleInputChange(e, 'date')}
              {...fieldProps('date')}
            />
            <ErrorText name="date" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reason">Motivo</label>
            <input
              className={styles.input}
              id="reason"
              type="text"
              placeholder="Ej.: control de rutina"
              maxLength={200}
              value={formData.reason}
              onChange={(e) => handleInputChange(e, 'reason')}
              {...fieldProps('reason')}
            />
            <ErrorText name="reason" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Detalles <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea
              className={styles.textarea}
              id="description"
              placeholder="Observaciones de la consulta"
              value={formData.description}
              onChange={(e) => handleInputChange(e, 'description')}
            />
          </div>

          {!showMeasurements ? (
            <button type="button" className={styles.addMeasurementsBtn} onClick={handleAddMeasurements}>
              + Agregar mediciones
            </button>
          ) : (
            <fieldset className={styles.measurementBox}>
              <div className={styles.measurementHeader}>
                <legend className={styles.legend}>Mediciones</legend>
                <button type="button" className={styles.removeMeasurementsBtn} onClick={handleRemoveMeasurements}>
                  Quitar mediciones
                </button>
              </div>

              <div className={styles.measurementGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="weight">Peso (kg)</label>
                  <input
                    className={styles.input}
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0.3"
                    max="150"
                    placeholder="Ej.: 18,5"
                    value={formData.measurement.weight}
                    onChange={(e) => handleMeasurementChange(e, 'weight')}
                    {...fieldProps('weight')}
                  />
                  <ErrorText name="weight" />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="height">Talla (cm)</label>
                  <input
                    className={styles.input}
                    id="height"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder="Ej.: 110"
                    value={formData.measurement.height}
                    onChange={(e) => handleMeasurementChange(e, 'height')}
                    {...fieldProps('height')}
                  />
                  <ErrorText name="height" />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="headCircumference">
                    Perímetro cefálico (cm) <span className={styles.optional}>(opcional)</span>
                  </label>
                  <input
                    className={styles.input}
                    id="headCircumference"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="25"
                    max="65"
                    placeholder="Ej.: 48"
                    value={formData.measurement.headCircumference}
                    onChange={(e) => handleMeasurementChange(e, 'headCircumference')}
                    {...fieldProps('headCircumference')}
                  />
                  <ErrorText name="headCircumference" />
                </div>
              </div>
            </fieldset>
          )}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className={styles.secondaryBtn} onClick={onClose}>Cancelar</button>
        <button type="submit" form="consultation-form" className={styles.primaryBtn}>Guardar</button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateConsultationModal