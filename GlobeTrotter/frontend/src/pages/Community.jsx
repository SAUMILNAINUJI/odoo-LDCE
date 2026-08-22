import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

export default function Community() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/community').then(res => setPosts(res.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    await api.post('/community', { content })
    setContent('')
    load()
  }

  const like = async (postId) => {
    await api.put(`/community/${postId}/like`)
    load()
  }

  return (
    <DashboardLayout title="Community" subtitle="Share your travel experiences and get inspired by others">
      <form onSubmit={submit} className="card p-5 mb-6 flex items-center gap-3">
        <input
          className="input-field flex-1" placeholder="Share a tip, story, or highlight from your trip..."
          value={content} onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">
          <Send className="w-4 h-4" /> Post
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading community posts...</p>
      ) : posts.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Be the first to share something with the community!</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold text-sm">
                  {post.User?.first_name?.[0]}{post.User?.last_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">{post.User?.first_name} {post.User?.last_name}</p>
                  <p className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                {post.Trip && <span className="badge bg-brand-50 text-brand-600 ml-auto">{post.Trip.name}</span>}
              </div>
              <p className="text-sm text-slate-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4">
                <button onClick={() => like(post.id)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors">
                  <Heart className="w-4 h-4" /> {post.likes_count}
                </button>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <MessageCircle className="w-4 h-4" /> Discuss
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
