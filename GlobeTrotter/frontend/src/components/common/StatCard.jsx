export default function StatCard({ icon: Icon, label, value, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    teal: 'bg-teal-50 text-accent-teal',
    amber: 'bg-amber-50 text-accent-amber',
    coral: 'bg-rose-50 text-accent-coral'
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accents[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-navy-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
