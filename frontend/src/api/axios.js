import axios from 'axios'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'

export function normalizeApiError(error) {
  const normalizedError = error ?? new Error(DEFAULT_ERROR_MESSAGE)
  const status = normalizedError.response?.status
  const apiMessage = normalizedError.response?.data?.message

  let userMessage = apiMessage || DEFAULT_ERROR_MESSAGE

  if (!navigator.onLine) {
    userMessage = 'You appear to be offline. Check your connection and try again.'
  } else if (normalizedError.code === 'ECONNABORTED') {
    userMessage = 'The request took too long. Please try again.'
  } else if (!normalizedError.response) {
    userMessage = 'Unable to reach the server right now. Please try again.'
  } else if (status >= 500) {
    userMessage = 'The server hit a problem. Please try again in a moment.'
  } else if (status === 404 && !apiMessage) {
    userMessage = 'The requested resource could not be found.'
  } else if (status === 403 && !apiMessage) {
    userMessage = 'You do not have permission to perform this action.'
  } else if (status === 401 && !apiMessage) {
    userMessage = 'Your session is no longer valid. Please refresh and try again.'
  }

  normalizedError.userMessage = userMessage

  return normalizedError
}

const apiUrl = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiUrl.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
)

export default apiUrl
