import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusStyles = {
  upcoming: 'bg-brand-50 text-brand-600',
  ongoing: 'bg-amber-50 text-accent-amber',
  completed: 'bg-emerald-50 text-emerald-600'
}

export default function TripCard({ trip }) {
  const navigate = useNavigate()
  const cityNames = trip.Stops?.map(s => s.City?.name).filter(Boolean).join(' → ') || 'No stops added yet'

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="card overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div
        className="h-32 bg-hero-gradient bg-cover bg-center relative"
        style={trip.cover_photo ? { backgroundImage: `url(${trip.cover_photo})` } : {}}
      >
        <span className={`badge absolute top-3 right-3 ${statusStyles[trip.status] || statusStyles.upcoming} bg-white/90`}>
          {trip.status || 'upcoming'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-navy-900 truncate">{trip.name}</h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {cityNames}
        </p>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" /> {trip.start_date} to {trip.end_date}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">{trip.Stops?.length || 0} stops</span>
          <ArrowRight className="w-4 h-4 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
