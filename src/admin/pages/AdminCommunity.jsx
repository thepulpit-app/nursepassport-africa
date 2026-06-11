import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function timeAgo(date) {
  const diff = (new Date() - new Date(date)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AdminCommunity() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!data) { setLoading(false); return }

    const userIds = [...new Set(data.map(p => p.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, email, subscription_tier')
      .in('id', userIds)
    const profileMap = {}
    profilesData?.forEach(p => { profileMap[p.id] = p })
    setPosts(data.map(p => ({ ...p, author: profileMap[p.user_id] || {} })))
    setLoading(false)
  }

  async function deletePost(postId) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(postId)
    // Delete comments first
    await supabase.from('community_comments').delete().eq('post_id', postId)
    await supabase.from('community_likes').delete().eq('post_id', postId)
    await supabase.from('community_posts').delete().eq('id', postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
    setDeleting(null)
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.post_type === filter)
  const totalLikes = posts.reduce((a, p) => a + (p.likes_count || 0), 0)
  const totalComments = posts.reduce((a, p) => a + (p.comments_count || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0A2540', margin: 0 }}>Community</h1>
        <button onClick={loadPosts} style={{ padding: '8px 16px', background: '#EEF2FF', border: 'none', borderRadius: '8px', color: '#4F46E5', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Posts', value: posts.length, color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'Total Likes', value: totalLikes, color: '#F43F5E', bg: '#FFF1F2' },
          { label: 'Total Comments', value: totalComments, color: '#22C55E', bg: '#F0FDF4' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'text', 'sim_score'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px', background: filter === f ? '#0A2540' : 'white', color: filter === f ? 'white' : '#64748B', border: filter !== f ? '1.5px solid #E2E8F0' : 'none' }}>
            {f === 'all' ? 'All Posts' : f === 'text' ? 'Text Posts' : 'Sim Scores'}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div style={{ color: '#94A3B8', padding: '40px', textAlign: 'center' }}>Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#94A3B8', padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px' }}>No posts yet</div>
      ) : filtered.map(post => (
        <div key={post.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '12px', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>
                {post.author?.full_name || 'Unknown'}
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '400', marginLeft: '8px' }}>{post.author?.email}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{timeAgo(post.created_at)}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                ❤️ {post.likes_count} · 💬 {post.comments_count}
              </div>
              <button onClick={() => deletePost(post.id)} disabled={deleting === post.id}
                style={{ background: '#FFF1F2', color: '#F43F5E', border: '1px solid #FECDD3', borderRadius: '8px', padding: '6px 12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', opacity: deleting === post.id ? 0.5 : 1 }}>
                {deleting === post.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          {post.post_type === 'sim_score' && (
            <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', fontSize: '12px', color: '#166534', fontWeight: '600' }}>
              🩺 Sim Score: {post.sim_score}% — {post.sim_scenario_title}
            </div>
          )}
          <p style={{ color: '#475569', fontSize: '14px', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
