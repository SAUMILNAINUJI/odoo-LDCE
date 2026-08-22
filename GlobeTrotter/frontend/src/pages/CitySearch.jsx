import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import CityCard from '../components/common/CityCard'
import api from '../api/axios'

export default function CitySearch() {
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [sort, setSort] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [style, setStyle] = useState('')
  const [tag, setTag] = useState('')
  const [minRating, setMinRating] = useState('')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount = [maxCost, style, tag, minRating].filter(Boolean).length

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/cities', { params: { search, sort, maxCost, style, tag, minRating } })
    setCities(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [sort, maxCost, style, tag, minRating])
  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t) }, [search])

  return (
    <DashboardLayout title="Explore Cities" subtitle="Discover and add destinations to your trips">
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-field pl-10" placeholder="Search by city name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="hidden sm:flex items-end justify-between gap-3">
          <div className="flex flex-1 gap-3"><FilterSelect label="Budget" value={maxCost} onChange={setMaxCost} options={['', '35', '60']} labels={['Any budget', 'Budget friendly', 'Moderate budget']} /><FilterSelect label="Style" value={style} onChange={setStyle} options={['', 'family', 'couple', 'adventure', 'historical', 'spiritual', 'nature']} labels={['Any style', 'Family', 'Couple', 'Adventure', 'Historical', 'Spiritual', 'Nature']} /><FilterSelect label="Tag" value={tag} onChange={setTag} options={['', 'beach', 'temple', 'cultural', 'budget']} labels={['Any tag', 'Beach', 'Temple', 'Cultural', 'Budget']} /><FilterSelect label="Rating" value={minRating} onChange={setMinRating} options={['', '4.5', '4.7']} labels={['Any rating', '4.5+', '4.7+']} /></div>
          <FilterSelect label="Sort" value={sort} onChange={setSort} options={['', 'cost_asc', 'cost_desc', 'name']} labels={['Popularity', 'Cost: Low to High', 'Cost: High to Low', 'Name (A-Z)']} />
        </div>
        <button onClick={() => setFiltersOpen(true)} className="sm:hidden btn-secondary justify-center"><SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && <span className="badge bg-brand-500 text-white">{activeFilterCount}</span>}</button>
      </div>

      {filtersOpen && <div className="fixed inset-0 z-50 sm:hidden"><div className="absolute inset-0 bg-slate-950/50" onClick={() => setFiltersOpen(false)} /><div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-lg font-bold text-slate-900">Filters</h2><button onClick={() => setFiltersOpen(false)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close filters"><X className="h-5 w-5" /></button></div><div className="grid gap-4"><FilterSelect label="Budget" value={maxCost} onChange={setMaxCost} options={['', '35', '60']} labels={['Any budget', 'Budget friendly', 'Moderate budget']} /><FilterSelect label="Style" value={style} onChange={setStyle} options={['', 'family', 'couple', 'adventure', 'historical', 'spiritual', 'nature']} labels={['Any style', 'Family', 'Couple', 'Adventure', 'Historical', 'Spiritual', 'Nature']} /><FilterSelect label="Tag" value={tag} onChange={setTag} options={['', 'beach', 'temple', 'cultural', 'budget']} labels={['Any tag', 'Beach', 'Temple', 'Cultural', 'Budget']} /><FilterSelect label="Rating" value={minRating} onChange={setMinRating} options={['', '4.5', '4.7']} labels={['Any rating', '4.5+', '4.7+']} /><FilterSelect label="Sort" value={sort} onChange={setSort} options={['', 'cost_asc', 'cost_desc', 'name']} labels={['Popularity', 'Cost: Low to High', 'Cost: High to Low', 'Name (A-Z)']} /></div><button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">Show destinations</button></div></div>}

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

function FilterSelect({ label, value, onChange, options, labels }) {
  return <label className="block min-w-0 flex-1"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span><select className="input-field w-full text-xs" value={value} onChange={event => onChange(event.target.value)}>{options.map((option, index) => <option key={option} value={option}>{labels[index]}</option>)}</select></label>
}
