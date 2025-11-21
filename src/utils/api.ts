const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getAuthHeaders(extra: Record<string, string> = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}


