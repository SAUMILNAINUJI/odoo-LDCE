import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import CityCard from '../components/common/CityCard'
import api from '../api/axios'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', cover_photo: '' })
  const [suggestedCities, setSuggestedCities] = useState([])
  const [destinationId, setDestinationId] = useState(params.get('city_id') || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/cities').then(res => setSuggestedCities(res.data.slice(0, 6))).catch(() => {})
  }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (new Date(form.start_date) > new Date(form.end_date)) {
      setError('End date must be greater than or equal to start date')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/trips', form)
      navigate(`/trips/${data.id}/build${destinationId ? `?city_id=${destinationId}` : ''}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Plan a New Trip" subtitle="Give your trip a name and travel window to get started">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-3 rounded-xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Trip Name</label>
              <input required className="input-field" placeholder="e.g. Summer Europe Getaway" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label className="label">Starting Destination</label>
              <select className="input-field" value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
                <option value="">Choose a destination in the itinerary builder</option>
                {suggestedCities.map(city => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input type="date" required className="input-field" value={form.start_date} onChange={update('start_date')} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" required className="input-field" value={form.end_date} onChange={update('end_date')} />
              </div>
            </div>
            <div>
              <label className="label">Cover Photo URL (optional)</label>
              <input className="input-field" placeholder="https://..." value={form.cover_photo} onChange={update('cover_photo')} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={4} className="input-field" placeholder="What's this trip about?" value={form.description} onChange={update('description')} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating...' : 'Continue to Itinerary Builder'}
            </button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h3 className="font-display font-semibold text-navy-900">Suggested Destinations</h3>
          </div>
          <div className="space-y-4">
            {suggestedCities.map(city => <CityCard key={city.id} city={city} />)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
