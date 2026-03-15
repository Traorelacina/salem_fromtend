import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL ?? '/api'

export function useApi() {
  const { token } = useAuth()

  const headers = (isFormData = false) => {
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    if (!isFormData) h['Content-Type'] = 'application/json'
    return h
  }

  const get = (path) =>
    fetch(`${API}${path}`, { headers: headers() }).then(r => r.json())

  const post = (path, body) => {
    const isFormData = body instanceof FormData
    return fetch(`${API}${path}`, {
      method: 'POST',
      headers: headers(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(r => r.json())
  }

  const put = (path, body) => {
    const isFormData = body instanceof FormData
    if (isFormData) {
      // Laravel needs _method for PUT with FormData
      body.append('_method', 'PUT')
      return fetch(`${API}${path}`, {
        method: 'POST',
        headers: headers(true),
        body,
      }).then(r => r.json())
    }
    return fetch(`${API}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    }).then(r => r.json())
  }

  const del = (path) =>
    fetch(`${API}${path}`, { method: 'DELETE', headers: headers() }).then(r => r.json())

  return { get, post, put, del }
}