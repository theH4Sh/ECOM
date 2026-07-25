import toast from 'react-hot-toast'

export function getErrorMessage(data, fallback = 'Something went wrong') {
  if (!data || typeof data !== 'object') return fallback

  if (typeof data.message === 'string' && data.message) return data.message
  if (typeof data.error === 'string' && data.error) return data.error
  if (typeof data.detail === 'string' && data.detail) return data.detail

  const firstKey = Object.keys(data).find((key) => key !== 'success')
  if (firstKey && Array.isArray(data[firstKey]) && data[firstKey][0]) {
    return data[firstKey][0]
  }

  return fallback
}

export async function parseApiError(response, fallback = 'Something went wrong') {
  try {
    const data = await response.json()
    return new Error(getErrorMessage(data, fallback))
  } catch {
    return new Error(fallback)
  }
}

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await parseApiError(response, `Request failed (${response.status})`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return null
}

export function toastApiError(err, fallback = 'Something went wrong') {
  toast.error(err?.message || fallback)
}
