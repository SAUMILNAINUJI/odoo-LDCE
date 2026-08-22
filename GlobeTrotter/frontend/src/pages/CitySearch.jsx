import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import CityCard from '../components/common/CityCard'
import api from '../api/axios'

export default function CitySearch() {
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [sort, setSort] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/cities', { params: { search, sort, maxCost } })
    setCities(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [sort, maxCost])
  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t) }, [search])

  return (
    <DashboardLayout title="Explore Cities" subtitle="Discover and add destinations to your trips">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-field pl-10" placeholder="Search by city name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-56" value={maxCost} onChange={(e) => setMaxCost(e.target.value)}>
          <option value="">Any budget</option>
          <option value="35">Budget friendly</option>
          <option value="60">Moderate budget</option>
        </select>
        <select className="input-field sm:w-56" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by popularity</option>
          <option value="cost_asc">Cost: Low to High</option>
          <option value="cost_desc">Cost: High to Low</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading cities...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cities.map(city => <CityCard key={city.id} city={city} />)}
        </div>
      )}
    </DashboardLayout>
  )
}
