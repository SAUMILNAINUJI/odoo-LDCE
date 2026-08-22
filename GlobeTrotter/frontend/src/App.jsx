import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import BudgetBreakdown from './pages/BudgetBreakdown'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import CalendarView from './pages/CalendarView'
import Community from './pages/Community'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import PublicItinerary from './pages/PublicItinerary'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/share/:token" element={<PublicItinerary />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/trips/new" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips/:id/build" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
      <Route path="/trips/:id/budget" element={<ProtectedRoute><BudgetBreakdown /></ProtectedRoute>} />
      <Route path="/cities" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}
