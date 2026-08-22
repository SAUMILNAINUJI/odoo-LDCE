import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Wallet, TrendingUp, Calendar } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import StatCard from '../components/common/StatCard'
import api from '../api/axios'

const COLORS = ['#0EA5E9', '#F59E0B', '#14B8A6', '#FB7185', '#8B5CF6', '#64748B']

export default function BudgetBreakdown() {
  const { id } = useParams()
  const [budget, setBudget] = useState(null)
  const [tripName, setTripName] = useState('')

  useEffect(() => {
    api.get(`/trips/${id}/budget`).then(res => setBudget(res.data))
    api.get(`/trips/${id}`).then(res => setTripName(res.data.name))
  }, [id])

  if (!budget) return <DashboardLayout title="Budget"><p className="text-slate-400 text-sm">Loading...</p></DashboardLayout>

  const pieData = Object.entries(budget.breakdown_by_category)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k, value: parseFloat(v) }))

  const barData = Object.entries(budget.breakdown_by_category).map(([k, v]) => ({ category: k, amount: parseFloat(v) }))

  return (
    <DashboardLayout title={`Budget — ${tripName}`} subtitle="Estimated cost breakdown and daily averages">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Wallet} label="Grand Total" value={`$${Math.round(budget.grand_total)}`} accent="brand" />
        <StatCard icon={TrendingUp} label="Activity Cost" value={`$${Math.round(budget.total_activity_cost)}`} accent="teal" />
        <StatCard icon={Wallet} label="Section Budgets" value={`$${Math.round(budget.stops_budget_allocated)}`} accent="amber" />
        <StatCard icon={Calendar} label="Avg / Day" value={`$${Math.round(budget.average_per_day)}`} accent="coral" />
      </div>
      {budget.planned_budget > 0 && <div className={`card mb-6 p-4 border ${budget.remaining_budget < 0 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}><p className={`text-sm font-semibold ${budget.remaining_budget < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{budget.remaining_budget < 0 ? `Over budget by $${Math.round(Math.abs(budget.remaining_budget))}` : `$${Math.round(budget.remaining_budget)} remaining from your planned budget`}</p><p className="mt-1 text-xs text-slate-500">Planned budget: ${Math.round(budget.planned_budget)}</p></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy-900 mb-4">Cost by Category</h3>
          {pieData.length === 0 ? <p className="text-sm text-slate-400">No expenses recorded yet.</p> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy-900 mb-4">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {budget.grand_total > 0 && budget.average_per_day > 300 && (
        <div className="card p-4 mt-6 bg-amber-50 border-amber-200 text-amber-700 text-sm">
          Heads up — your average daily spend is on the higher side. Consider adjusting activities to stay within budget.
        </div>
      )}
    </DashboardLayout>
  )
}
