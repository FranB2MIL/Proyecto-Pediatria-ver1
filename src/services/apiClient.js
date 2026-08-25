const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5072/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status}`)
  }

  if (response.status === 204) return null

  return response.json()
}