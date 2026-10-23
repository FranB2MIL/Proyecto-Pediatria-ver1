// El back guarda la talla en METROS y el perímetro cefálico en el campo "size".
// El doctor ve y carga todo en CENTÍMETROS.

const cmToM = (cm) => cm / 100
const mToCm = (m) => Math.round(m * 1000) / 10 // 1.105 m → 110.5 cm

// Un 0 o un null en una medición significa "no se midió".
export const hasValue = (v) => v !== null && v !== undefined && v !== 0 && v !== ''

// Del back al formulario: null si la consulta no tiene mediciones.
export function toFormMeasurement(measurement) {
  if (!measurement || !hasValue(measurement.weight)) return null
  return {
    weight: String(measurement.weight),
    height: String(mToCm(measurement.height)),
    headCircumference: hasValue(measurement.size) ? String(measurement.size) : '',
  }
}

// Del formulario al back: null si el doctor no cargó mediciones.
export function toApiMeasurement(formMeasurement) {
  if (!formMeasurement) return null
  return {
    weight: Number(formMeasurement.weight),
    height: cmToM(Number(formMeasurement.height)),
    size: formMeasurement.headCircumference === '' ? null : Number(formMeasurement.headCircumference),
  }
}

// Para mostrar en la tarjeta y el historial.
export const heightInCm = (measurement) =>
  measurement && hasValue(measurement.height) ? mToCm(measurement.height) : null
export const headCircumferenceInCm = (measurement) =>
  measurement && hasValue(measurement.size) ? measurement.size : null