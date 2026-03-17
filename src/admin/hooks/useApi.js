import { useAuth } from '../context/AuthContext'

// ✅ IMPORTANT : on ajoute /api ici UNE SEULE FOIS
const API = (import.meta.env.VITE_API_URL || '') + '/api'

export function useApi() {
  const { token, logout } = useAuth()

  const headers = (isFormData = false) => {
    const h = {
      Accept: 'application/json',
    }

    if (token) {
      h['Authorization'] = `Bearer ${token}`
    }

    if (!isFormData) {
      h['Content-Type'] = 'application/json'
    }

    return h
  }

  // ✅ Gestion propre des réponses (évite erreur JSON)
  const handleResponse = async (res) => {
    const contentType = res.headers.get('content-type')

    let data
    if (contentType && contentType.includes('application/json')) {
      data = await res.json()
    } else {
      data = await res.text()
    }

    if (!res.ok) {
      if (res.status === 401) {
        logout?.()
      }
      throw new Error(data?.message || 'Erreur API')
    }

    return data
  }

  // GET
  const get = async (path) => {
    const res = await fetch(`${API}${path}`, {
      method: 'GET',
      headers: headers(),
    })
    return handleResponse(res)
  }

  // POST
  const post = async (path, body) => {
    const isFormData = body instanceof FormData

    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: headers(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    })

    return handleResponse(res)
  }

  // PUT
  const put = async (path, body) => {
    const isFormData = body instanceof FormData

    if (isFormData) {
      body.append('_method', 'PUT')

      const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: headers(true),
        body,
      })

      return handleResponse(res)
    }

    const res = await fetch(`${API}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    })

    return handleResponse(res)
  }

  // DELETE
  const del = async (path) => {
    const res = await fetch(`${API}${path}`, {
      method: 'DELETE',
      headers: headers(),
    })

    return handleResponse(res)
  }

  return { get, post, put, del }
}