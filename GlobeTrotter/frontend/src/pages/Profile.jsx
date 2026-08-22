import { useEffect, useState } from 'react'
import { Pencil, Trash2, Eye, MapPin, Mail, Phone, Home, MessageSquare, Settings as SettingsIcon, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CameraCapture from '../components/common/CameraCapture'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('app')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...user })
  const [trips, setTrips] = useState({ upcoming: [], completed: [] })
  const [locationCities, setLocationCities] = useState([])
  const [msg, setMsg] = useState('')

  // Toggles state matching Screenshot 2
  const [settings, setSettings] = useState({
    followNotifications: true,
    postNotifications: false,
    mentionNotifications: true,
    newLaunches: true,
    monthlyDigest: false
  })

  const countries = [...new Set(locationCities.map(city => city.country).filter(Boolean))]
  const availableCities = locationCities.filter(city => city.country === form.country).map(city => city.name)

  useEffect(() => {
    api.get('/trips').then(res => {
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        setTrips(res.data)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    api.get('/cities').then(res => setLocationCities(Array.isArray(res.data) ? res.data : [])).catch(() => setLocationCities([]))
  }, [])

  const toggleSetting = (key) => () => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateField = (field) => (e) => {
    const val = e.target.value
    setForm(prev => {
      const next = { ...prev, [field]: val }
      if (field === 'country' && val !== prev.country) {
        next.state = ''
        next.city = ''
      }
      if (field === 'state' && val !== prev.state) {
        next.city = ''
      }
      return next
    })
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put('/users/profile', form)
      updateUser(data)
      setEditing(false)
      setMsg('Profile updated successfully')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    await api.delete('/users/profile')
    logout()
    navigate('/login')
  }

  return (
    <DashboardLayout title="Profile" subtitle="Material Tailwind style profile details and settings">
      
      {/* Top Dark Header Banner (Matching Image 2) */}
      <div className="relative mb-20">
        <div className="h-44 w-full bg-[#18181B] bg-3d-waves rounded-3xl shadow-lg border border-zinc-800 relative overflow-hidden" />

        {/* Overlapping Main Profile Card (Matching Image 2) */}
        <div className="card p-6 sm:p-8 mx-4 sm:mx-6 relative -mt-24 shadow-xl border border-slate-200 bg-white rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 text-white font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-md shrink-0">
                {user?.photo ? (
                  <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                )}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-xs text-slate-500 font-medium capitalize">
                  {user?.role === 'admin' ? 'Administrator / Platform Lead' : 'Travel Enthusiast & Itinerary Explorer'}
                </p>
              </div>
            </div>

            {/* Top Right Tabs (Matching Image 2) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('app')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'app' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" /> App
              </button>

              <button
                onClick={() => setActiveTab('message')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'message' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" /> Settings
              </button>
            </div>
          </div>

          {msg && (
            <div className="mt-4 flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> {msg}
            </div>
          )}

          {/* 3-Column Content Layout (Matching Image 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            
            {/* Column 1: Platform Settings (Matching Image 2) */}
            <div className="space-y-6">
              <h3 className="font-display font-bold text-slate-900 text-sm tracking-tight">Platform Settings</h3>
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACCOUNT</p>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-600 font-medium">Email me when someone follows me</span>
                  <input
                    type="checkbox"
                    checked={settings.followNotifications}
                    onChange={toggleSetting('followNotifications')}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-600 font-medium">Email me when someone answers on my post</span>
                  <input
                    type="checkbox"
                    checked={settings.postNotifications}
                    onChange={toggleSetting('postNotifications')}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-600 font-medium">Email me when someone mentions me</span>
                  <input
                    type="checkbox"
                    checked={settings.mentionNotifications}
                    onChange={toggleSetting('mentionNotifications')}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-2">APPLICATION</p>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-600 font-medium">New launches and projects</span>
                  <input
                    type="checkbox"
                    checked={settings.newLaunches}
                    onChange={toggleSetting('newLaunches')}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Column 2: Profile Information (Matching Image 2) */}
            <div className="space-y-4 border-y lg:border-y-0 lg:border-x border-slate-100 py-6 lg:py-0 lg:px-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-slate-900 text-sm tracking-tight">Profile Information</h3>
                <button
                  onClick={() => { setForm({ ...user }); setEditing(!editing) }}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
                  title="Edit Profile"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {!editing ? (
                <>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {user?.additional_info || "Hi, I'm a passionate traveler. GlobeTrotter empowers me to create structured itineraries, estimate travel costs, and share journeys with the community."}
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <strong className="text-slate-900 font-bold min-w-20">First Name:</strong>
                      <span>{user?.first_name} {user?.last_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <strong className="text-slate-900 font-bold min-w-20">Mobile:</strong>
                      <span>{user?.phone || '(44) 123 1234 123'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <strong className="text-slate-900 font-bold min-w-20">Email:</strong>
                      <span>{user?.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <strong className="text-slate-900 font-bold min-w-20">Location:</strong>
                      <span>{[user?.city, user?.state, user?.country].filter(Boolean).join(', ') || 'Not provided'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={saveProfile} className="space-y-3 pt-2">
                  <CameraCapture photo={form.photo} setPhoto={(p) => setForm(prev => ({ ...prev, photo: p }))} />

                  <div className="grid grid-cols-2 gap-2">
                    <input className="input-field py-2 text-xs" value={form.first_name || ''} onChange={updateField('first_name')} placeholder="First Name" />
                    <input className="input-field py-2 text-xs" value={form.last_name || ''} onChange={updateField('last_name')} placeholder="Last Name" />
                  </div>

                  <input className="input-field py-2 text-xs" value={form.phone || ''} onChange={updateField('phone')} placeholder="Mobile Phone" />

                  {/* Cascading Location Selection */}
                  <div className="grid grid-cols-3 gap-2">
                    <input list="prof-countries" className="input-field py-2 text-xs" value={form.country || ''} onChange={updateField('country')} placeholder="Country" />
                    <datalist id="prof-countries">{countries.map(c => <option key={c} value={c} />)}</datalist>

                    <input list="prof-states" className="input-field py-2 text-xs" value={form.state || ''} onChange={updateField('state')} placeholder="State" />
                    <datalist id="prof-states">{availableStates.map(s => <option key={s} value={s} />)}</datalist>

                    <input list="prof-cities" className="input-field py-2 text-xs" value={form.city || ''} onChange={updateField('city')} placeholder="City" />
                    <datalist id="prof-cities">{availableCities.map(ct => <option key={ct} value={ct} />)}</datalist>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="btn-primary text-xs py-2 px-4">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Column 3: Conversations & Contacts (Matching Image 2) */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-slate-900 text-sm tracking-tight">Conversations</h3>
              
              <div className="space-y-3">
                <p className="text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl p-4">
                  No conversations available yet.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Trips Listing Section */}
      <div className="space-y-6">
        <TripGrid title="Preplanned Itineraries" trips={trips.upcoming} />
        <TripGrid title="Completed Travel Histories" trips={trips.completed} />
      </div>

      {/* Account Deletion */}
      <div className="card p-6 mt-8 border border-rose-200 bg-rose-50/20">
        <h3 className="font-display font-bold text-rose-600 text-sm mb-1">Account Management</h3>
        <p className="text-xs text-slate-500 mb-4">Permanently erase your account and all associated itineraries.</p>
        <button onClick={deleteAccount} className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition">
          <Trash2 className="w-3.5 h-3.5" /> Delete Account
        </button>
      </div>

    </DashboardLayout>
  )
}

function TripGrid({ title, trips }) {
  const navigate = useNavigate()
  return (
    <div className="mb-6">
      <h3 className="font-display font-bold text-sm text-slate-900 mb-3">{title}</h3>
      {(!trips || trips.length === 0) ? (
        <p className="text-xs text-slate-400">No trips added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(t => (
            <div key={t.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 text-xs">{t.name}</p>
                <p className="text-[11px] text-slate-400">{t.start_date} — {t.end_date}</p>
              </div>
              <button onClick={() => navigate(`/trips/${t.id}`)} className="btn-secondary text-xs px-3 py-1.5">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
