import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('gt_user') || 'null')
        if (!stored?.token) return
        const { data } = await api.get('/users/profile')
        const session = { ...data, token: stored.token }
        localStorage.setItem('gt_user', JSON.stringify(session))
        setUser(session)
      } catch {
        localStorage.removeItem('gt_user')
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }
    const expireSession = () => {
      localStorage.removeItem('gt_user')
      setUser(null)
    }
    window.addEventListener('gt:session-expired', expireSession)
    restoreSession()
    return () => window.removeEventListener('gt:session-expired', expireSession)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('gt_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('gt_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('gt_user')
    setUser(null)
  }

  const updateUser = (data) => {
    const merged = { ...user, ...data }
    localStorage.setItem('gt_user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
