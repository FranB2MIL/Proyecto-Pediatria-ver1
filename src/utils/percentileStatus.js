// Placeholder heuristic — reemplazar cuando se defina la regla de negocio real para clasificar percentilos.
export const getPercentileStatus = (value) => {
  if (value === undefined || value === null) return null

  const isNormal = value >= 10 && value <= 90

  return isNormal
    ? { label: 'normal', dotColor: '#7FA88A', bg: '#EAF1E8', textColor: '#3D6B4C' }
    : { label: 'atención', dotColor: '#D9A441', bg: '#FBF1DE', textColor: '#8A5A0A' }
}
