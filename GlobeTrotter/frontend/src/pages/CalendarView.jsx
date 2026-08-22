import { useEffect, useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const tripColors = ['bg-brand-100 text-brand-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700']

export default function CalendarView() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [cursor, setCursor] = useState(new Date())

  useEffect(() => {
    api.get('/trips').then(res => {
      const all = [...res.data.ongoing, ...res.data.upcoming, ...res.data.completed]
      setTrips(all)
    })
  }, [])

  const tripForDate = (dateStr) => trips.find(t => t.start_date <= dateStr && t.end_date >= dateStr)

  const grid = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [cursor])

  const changeMonth = (delta) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1))
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <DashboardLayout title="Calendar View" subtitle="See all your trips laid out across the month">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="font-display font-bold text-lg text-navy-900">{monthNames[cursor.getMonth()]} {cursor.getFullYear()}</h3>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {grid.map((day, idx) => {
            if (!day) return <div key={idx} />
            const dateStr = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(day)}`
            const trip = tripForDate(dateStr)
            const colorIdx = trip ? trips.indexOf(trip) % tripColors.length : 0
            return (
              <div
                key={idx}
                onClick={() => trip && navigate(`/trips/${trip.id}`)}
                className={`min-h-20 rounded-xl p-2 border border-slate-100 text-sm ${trip ? `cursor-pointer ${tripColors[colorIdx]}` : 'text-slate-600'}`}
              >
                <p className="font-semibold">{day}</p>
                {trip && <p className="text-[10px] font-medium mt-1 truncate">{trip.name}</p>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {trips.map((t, i) => (
          <span key={t.id} className={`badge ${tripColors[i % tripColors.length]}`}>{t.name}</span>
        ))}
      </div>
    </DashboardLayout>
  )
}
