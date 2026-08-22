import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { Users, PlaneTakeoff, MapPin, Sparkles, Trash2, Shield, UserCheck, Search, Filter } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import StatCard from '../components/common/StatCard'
import api from '../api/axios'

const COLORS = ['#18181B', '#3F3F46', '#71717A', '#A1A1AA', '#D4D4D8', '#0EA5E9']

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const [citiesList, setCitiesList] = useState([])
  const [cityForm, setCityForm] = useState({ name: '', country: '', cost_index: 50, popularity: 50, description: '', image_url: '' })
  const [activityForm, setActivityForm] = useState({ city_id: '', name: '', category: 'sightseeing', cost: 0, duration_hours: 1, description: '', image_url: '' })
  const [destMsg, setDestMsg] = useState('')
  const [destErr, setDestErr] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data || {})).catch(() => setStats({ totalUsers: 0, totalTrips: 0, totalCities: 0, totalActivities: 0, popularCities: [], tripsByStatus: [] }))
    api.get('/admin/users').then(res => setUsers(Array.isArray(res.data) ? res.data : [])).catch(() => setUsers([]))
    api.get('/cities').then(res => setCitiesList(res.data)).catch(() => {})
  }, [tab])

  const removeUser = async (id) => {
    if (!confirm('Permanently remove this user account?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove user')
    }
  }

  const toggleAdminRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change role of ${user.first_name} to ${newRole}?`)) return
    try {
      await api.put(`/users/${user.id}/role`, { role: newRole })
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role')
    }
  }

  const handleCreateCity = async (e) => {
    e.preventDefault()
    setDestMsg('')
    setDestErr('')
    try {
      const { data } = await api.post('/cities', cityForm)
      setDestMsg(`Successfully added city: ${data.name}!`)
      setCitiesList([...citiesList, data])
      setCityForm({ name: '', country: '', cost_index: 50, popularity: 50, description: '', image_url: '' })
    } catch (err) {
      setDestErr(err.response?.data?.message || 'Could not create city')
    }
  }

  const handleCreateActivity = async (e) => {
    e.preventDefault()
    setDestMsg('')
    setDestErr('')
    try {
      const { data } = await api.post('/activities', activityForm)
      setDestMsg(`Successfully added activity: ${data.name}!`)
      setActivityForm({ city_id: '', name: '', category: 'sightseeing', cost: 0, duration_hours: 1, description: '', image_url: '' })
    } catch (err) {
      setDestErr(err.response?.data?.message || 'Could not create activity')
    }
  }

  if (!stats) return <DashboardLayout title="Admin Control Center"><p className="text-slate-400 text-sm">Loading analytics data...</p></DashboardLayout>

  const statusData = (stats.tripsByStatus || []).map(t => ({
    name: t.status ? t.status.toUpperCase() : 'OTHER',
    value: parseInt(t.dataValues ? t.dataValues.count : t.count || 1)
  }))

  const cityData = (stats.popularCities || []).map(c => ({
    name: c.City?.name || c.name || 'Destination',
    visits: parseInt(c.dataValues ? c.dataValues.visits : c.visits || 1)
  }))

  const countryData = (stats.usersByCountry || []).map(item => ({
    country: item.country || 'Unknown',
    count: Number(item.dataValues?.count || item.count || 0)
  })).slice(0, 5)

  const trendData = (stats.growthTrend || []).map(item => ({
    month: item.month,
    trips: Number(item.trips || 0),
    users: Number(item.users || 0)
  }))

  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.first_name} ${u.last_name} ${u.email} ${u.city} ${u.country}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <DashboardLayout title="Admin Control Center" subtitle="Manage users, platform analytics, trends, and access roles">
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
        {['overview', 'users', 'analytics', 'destinations'].map(t => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              tab === t ? 'bg-zinc-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Top Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Registered Users" value={stats.totalUsers || users.length} accent="brand" />
            <StatCard icon={PlaneTakeoff} label="Total Trips" value={stats.totalTrips || 0} accent="teal" />
            <StatCard icon={MapPin} label="Available Cities" value={stats.totalCities || 0} accent="amber" />
            <StatCard icon={Sparkles} label="Curated Activities" value={stats.totalActivities || 0} accent="coral" />
          </div>

          {/* Grid of Visual Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Chart 1: Trip Status Breakdown */}
            <div className="card p-6 border border-slate-200">
              <h3 className="font-display font-bold text-navy-900 text-sm mb-4">Trip Status Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                    {statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Top Popular Destinations */}
            <div className="card p-6 border border-slate-200">
              <h3 className="font-display font-bold text-navy-900 text-sm mb-4">Top Visited Cities</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#18181B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Platform Growth Area Chart */}
          <div className="card p-6 border border-slate-200">
            <h3 className="font-display font-bold text-navy-900 text-sm mb-4">User & Trip Growth Trends</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#18181B" fill="#27272A" fillOpacity={0.2} name="Trips Created" />
                <Area type="monotone" dataKey="users" stroke="#71717A" fill="#A1A1AA" fillOpacity={0.2} name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 border border-slate-200">
            <h3 className="font-display font-bold text-navy-900 text-sm mb-4">User Origin Demographics</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#3F3F46" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6 border border-slate-200">
            <h3 className="font-display font-bold text-navy-900 text-sm mb-4">Platform Health Summary</h3>
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Database Sync Status</span>
                <span className="badge bg-emerald-100 text-emerald-800">Connected & Synced</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Body Payload Limit</span>
                <span className="badge bg-zinc-900 text-white">10 MB (Base64 Ready)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Default User Role</span>
                <span className="badge bg-slate-200 text-slate-800">User</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Camera & Photo Capture</span>
                <span className="badge bg-emerald-100 text-emerald-800">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card border border-slate-200 p-6 space-y-4">
          {/* User Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name, email, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field text-xs py-2"
              >
                <option value="all">All Roles</option>
                <option value="user">User Role Only</option>
                <option value="admin">Admin Role Only</option>
              </select>
            </div>
          </div>

          {/* User Management Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left uppercase tracking-wider text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition">
                    <td className="p-3 font-semibold text-navy-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden">
                        {u.photo ? (
                          <img src={u.photo} alt="User photo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{u.first_name?.[0]}</span>
                        )}
                      </div>
                      <span>{u.first_name} {u.last_name}</span>
                    </td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3 text-slate-500">{u.phone || '—'}</td>
                    <td className="p-3 text-slate-500">{[u.city, u.state, u.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="p-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-zinc-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => toggleAdminRole(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-zinc-950 hover:bg-slate-100 transition"
                        title={u.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => removeUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'destinations' && (
        <div className="space-y-6">
          {/* Status feedback */}
          {destMsg && <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">{destMsg}</div>}
          {destErr && <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">{destErr}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form 1: Add City */}
            <div className="card p-6 border border-slate-200 space-y-4">
              <h3 className="font-display font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Add New City (Destination)</h3>
              <form onSubmit={handleCreateCity} className="space-y-3 text-xs">
                <div>
                  <label className="label">City Name *</label>
                  <input
                    type="text" required className="input-field py-2 text-xs" placeholder="e.g. Kyoto"
                    value={cityForm.name} onChange={e => setCityForm({ ...cityForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Country *</label>
                  <input
                    type="text" required className="input-field py-2 text-xs" placeholder="e.g. Japan"
                    value={cityForm.country} onChange={e => setCityForm({ ...cityForm, country: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Cost Index (1-100)</label>
                    <input
                      type="number" min="1" max="100" className="input-field py-2 text-xs"
                      value={cityForm.cost_index} onChange={e => setCityForm({ ...cityForm, cost_index: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                  <div>
                    <label className="label">Popularity (1-100)</label>
                    <input
                      type="number" min="1" max="100" className="input-field py-2 text-xs"
                      value={cityForm.popularity} onChange={e => setCityForm({ ...cityForm, popularity: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Image URL (optional)</label>
                  <input
                    type="text" className="input-field py-2 text-xs" placeholder="https://..."
                    value={cityForm.image_url} onChange={e => setCityForm({ ...cityForm, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows="3" className="input-field py-2 text-xs" placeholder="Describe the city..."
                    value={cityForm.description} onChange={e => setCityForm({ ...cityForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold mt-2">
                  Create Destination City
                </button>
              </form>
            </div>

            {/* Form 2: Add Activity */}
            <div className="card p-6 border border-slate-200 space-y-4">
              <h3 className="font-display font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Add New Activity</h3>
              <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
                <div>
                  <label className="label">Select Destination City *</label>
                  <select
                    required className="input-field py-2 text-xs"
                    value={activityForm.city_id} onChange={e => setActivityForm({ ...activityForm, city_id: e.target.value })}
                  >
                    <option value="">Choose a city</option>
                    {citiesList.map(c => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Activity Name *</label>
                  <input
                    type="text" required className="input-field py-2 text-xs" placeholder="e.g. Bamboo Forest Walk"
                    value={activityForm.name} onChange={e => setActivityForm({ ...activityForm, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="label">Category</label>
                    <select
                      className="input-field py-2 text-xs"
                      value={activityForm.category} onChange={e => setActivityForm({ ...activityForm, category: e.target.value })}
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food</option>
                      <option value="adventure">Adventure</option>
                      <option value="transport">Transport</option>
                      <option value="stay">Stay</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Cost ($) *</label>
                    <input
                      type="number" min="0" required className="input-field py-2 text-xs"
                      value={activityForm.cost} onChange={e => setActivityForm({ ...activityForm, cost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Duration (Hours)</label>
                  <input
                    type="number" step="0.5" min="0.5" className="input-field py-2 text-xs"
                    value={activityForm.duration_hours} onChange={e => setActivityForm({ ...activityForm, duration_hours: parseFloat(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="label">Image URL (optional)</label>
                  <input
                    type="text" className="input-field py-2 text-xs" placeholder="https://..."
                    value={activityForm.image_url} onChange={e => setActivityForm({ ...activityForm, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows="2" className="input-field py-2 text-xs" placeholder="Describe the activity..."
                    value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold mt-2">
                  Create Travel Activity
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
