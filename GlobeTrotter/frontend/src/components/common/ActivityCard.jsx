import { Heart } from 'lucide-react'
import useFavorite from '../../hooks/useFavorite'

const categoryColors = {
  sightseeing: 'bg-brand-50 text-brand-600',
  food: 'bg-amber-50 text-accent-amber',
  adventure: 'bg-emerald-50 text-emerald-600',
  transport: 'bg-slate-100 text-slate-600',
  stay: 'bg-violet-50 text-violet-600',
  other: 'bg-rose-50 text-accent-coral'
}

export default function ActivityCard({ activity, onAdd }) {
  const { saved, saving, toggleFavorite } = useFavorite('activity', activity.id)
  return (
    <div className="card p-4 flex items-center gap-4 relative">
      <div
        className="w-16 h-16 rounded-xl bg-slate-200 bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url(${activity.image_url})` }}
      />
      <button onClick={toggleFavorite} disabled={saving} className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 text-slate-700 shadow-sm hover:text-rose-500 disabled:opacity-60" title={saved ? 'Remove from saved places' : 'Save activity'} aria-label={saved ? 'Remove activity from saved places' : 'Save activity'}><Heart className={`h-3.5 w-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} /></button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-navy-900 text-sm truncate">{activity.name}</h4>
          <span className={`badge ${categoryColors[activity.category] || categoryColors.other}`}>{activity.category}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{activity.City?.name} • {activity.duration_hours}h</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-display font-bold text-navy-900">${activity.cost}</p>
        {onAdd && (
          <button onClick={() => onAdd(activity)} className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-1">
            + Add
          </button>
        )}
      </div>
    </div>
  )
}
