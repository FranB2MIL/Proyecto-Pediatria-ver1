import { parseLocalDate } from './dateUtils'

// visual placeholder
export const AVATAR_COLORS = {
  green: { bg: '#7FA88A', text: '#F2F7F0' },
  red: { bg: '#C0392B', text: '#FBF7F2' },
  amber: { bg: '#D9A441', text: '#4A3105' },
}

const AVATAR_VARIANTS = Object.keys(AVATAR_COLORS)

/** 'green' | 'red' | 'amber' — siempre la misma para el mismo nombre. */
export const getAvatarVariant = (name = '') => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_VARIANTS[hash % AVATAR_VARIANTS.length]
}

export const getAvatarColors = (name = '') => AVATAR_COLORS[getAvatarVariant(name)]

export const calculateAge = (dateOfBirth) => {
  const birth = parseLocalDate(dateOfBirth)
  if (!birth) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  if (!hasHadBirthdayThisYear) age--
  return age
}

/** 43127649 -> "43.127.649" */
export const formatDni = (dni) => {
  const digits = String(dni ?? '').replace(/\D/g, '')
  if (!digits) return dni ?? '—'
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Número con coma decimal ("0,08"). Devuelve "—" si el dato falta. */
export const formatMeasure = (value, { decimals } = {}) => {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  return number.toLocaleString('es-AR', decimals === undefined
    ? { maximumFractionDigits: 2 }
    : { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
