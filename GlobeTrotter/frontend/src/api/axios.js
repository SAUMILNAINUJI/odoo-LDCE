import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('gt_user')
  if (stored) {
    try {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch (e) {
      localStorage.removeItem('gt_user')
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gt_user')
      window.dispatchEvent(new Event('gt:session-expired'))
    }
    return Promise.reject(error)
  }
)

export default api
