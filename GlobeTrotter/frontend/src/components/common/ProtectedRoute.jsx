import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading GlobeTrotter...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin" replace />
  return children
}
