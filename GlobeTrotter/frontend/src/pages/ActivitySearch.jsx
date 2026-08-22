import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ActivityCard from '../components/common/ActivityCard'
import api from '../api/axios'

const categories = ['sightseeing', 'food', 'adventure', 'transport', 'stay', 'other']

export default function ActivitySearch() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/activities', { params: { search, category } })
    setActivities(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [category])
  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t) }, [search])

  return (
    <DashboardLayout title="Activity Search" subtitle="Browse experiences across all destinations">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-field pl-10" placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading activities...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
        </div>
      )}
    </DashboardLayout>
  )
}
