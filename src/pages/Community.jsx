import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Send, X, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/layout/AppShell'

const GOAL_FLAGS = { UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', USA: '🇺🇸', Nigeria: '🇳🇬' }

function getInitials(name) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'
}

function timeAgo(date) {
  const diff = (new Date() - new Date(date)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Community() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [comments, setComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const textRef = useRef(null)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!postsData) { setLoading(false); return }

    // Get profiles for all post authors
    const userIds = [...new Set(postsData.map(p => p.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, career_goal, subscription_tier')
      .in('id', userIds)
    const profileMap = {}
    profilesData?.forEach(p => { profileMap[p.id] = p })

    const enriched = postsData.map(p => ({ ...p, author: profileMap[p.user_id] || {} }))
    setPosts(enriched)

    // Load user's likes
    if (user) {
      const { data: likesData } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id)
      setLikedPosts(new Set(likesData?.map(l => l.post_id) || []))
    }

    setLoading(false)
  }

  async function submitPost() {
    if (!newPost.trim() || !user) return
    setPosting(true)
    const { data } = await supabase.from('community_posts').insert({
      user_id: user.id,
      content: newPost.trim(),
      post_type: 'text',
    }).select().single()
    if (data) {
      const enriched = { ...data, author: { full_name: profile?.full_name, career_goal: profile?.career_goal, subscription_tier: profile?.subscription_tier } }
      setPosts(prev => [enriched, ...prev])
      setNewPost('')
    }
    setPosting(false)
  }

  async function toggleLike(postId) {
    if (!user) { navigate('/signin'); return }
    const isLiked = likedPosts.has(postId)
    if (isLiked) {
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      setLikedPosts(prev => { const s = new Set(prev); s.delete(postId); return s })
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p))
    } else {
      await supabase.from('community_likes').insert({ post_id: postId, user_id: user.id })
      setLikedPosts(prev => new Set([...prev, postId]))
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p))
    }
    // Update count in DB
    await supabase.from('community_posts').update({
      likes_count: isLiked ? Math.max(0, (posts.find(p => p.id === postId)?.likes_count || 1) - 1) : (posts.find(p => p.id === postId)?.likes_count || 0) + 1
    }).eq('id', postId)
  }

  async function loadComments(postId) {
    const { data } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (!data) return
    const userIds = [...new Set(data.map(c => c.user_id))]
    const { data: profilesData } = await supabase.from('profiles').select('id, full_name, career_goal').in('id', userIds)
    const profileMap = {}
    profilesData?.forEach(p => { profileMap[p.id] = p })
    setComments(prev => ({ ...prev, [postId]: data.map(c => ({ ...c, author: profileMap[c.user_id] || {} })) }))
  }

  async function toggleComments(postId) {
    if (expandedComments.has(postId)) {
      setExpandedComments(prev => { const s = new Set(prev); s.delete(postId); return s })
    } else {
      setExpandedComments(prev => new Set([...prev, postId]))
      if (!comments[postId]) await loadComments(postId)
    }
  }

  async function submitComment(postId) {
    if (!user) { navigate('/signin'); return }
    const content = newComments[postId]?.trim()
    if (!content) return
    const { data } = await supabase.from('community_comments').insert({
      post_id: postId, user_id: user.id, content
    }).select().single()
    if (data) {
      const enriched = { ...data, author: { full_name: profile?.full_name, career_goal: profile?.career_goal } }
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), enriched] }))
      setNewComments(prev => ({ ...prev, [postId]: '' }))
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
      await supabase.from('community_posts').update({ comments_count: (posts.find(p => p.id === postId)?.comments_count || 0) + 1 }).eq('id', postId)
    }
  }

  const TIER_BADGES = { nurse: { label: 'Nurse', color: '#4F46E5' }, passport: { label: 'Passport', color: '#F43F5E' }, student: { label: 'Student', color: '#059669' } }

  const content = (
    <>
      <style>{`
        .post-card { background: white; border-radius: 16px; border: 1px solid #F1F5F9; margin-bottom: 12px; overflow: hidden; }
        .comment-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F8FAFC; }
        .comment-item:last-child { border-bottom: none; }
      `}</style>

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0A2540', margin: '0 0 4px' }}>Community</h1>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Connect with nurses across Africa 🌍</p>
      </div>

      {/* Guest CTA */}
      {!user && (
        <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>Join the conversation</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Sign up free to post, like and comment</div>
          </div>
          <button onClick={() => navigate('/signup')}
            style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Join Free <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Post composer */}
      {user && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
              {getInitials(profile?.full_name)}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                ref={textRef}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Share a clinical tip, ask a question, or celebrate a win... 🩺"
                rows={3}
                style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '12px', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'system-ui, sans-serif', color: '#0A2540', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{newPost.length}/500</span>
                <button onClick={submitPost} disabled={!newPost.trim() || posting || newPost.length > 500}
                  style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: !newPost.trim() || posting ? 0.6 : 1 }}>
                  <Send size={14} /> {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? Array(3).fill(null).map((_, i) => (
        <div key={i} style={{ height: '120px', background: '#F1F5F9', borderRadius: '16px', marginBottom: '12px' }} />
      )) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0A2540', margin: '0 0 8px' }}>No posts yet</h3>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Be the first to start the conversation!</p>
        </div>
      ) : posts.map(post => (
        <div key={post.id} className="post-card">
          <div style={{ padding: '16px' }}>
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                {getInitials(post.author?.full_name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', color: '#0A2540', fontSize: '14px' }}>
                    {post.author?.full_name?.split(' ')[0] || 'Nurse'}
                  </span>
                  {post.author?.career_goal && <span>{GOAL_FLAGS[post.author.career_goal]}</span>}
                  {post.author?.subscription_tier && TIER_BADGES[post.author.subscription_tier] && (
                    <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '99px', background: TIER_BADGES[post.author.subscription_tier].color + '20', color: TIER_BADGES[post.author.subscription_tier].color }}>
                      {TIER_BADGES[post.author.subscription_tier].label}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{timeAgo(post.created_at)}</div>
              </div>
            </div>

            {/* Sim score badge */}
            {post.post_type === 'sim_score' && post.sim_score !== null && (
              <div style={{ background: post.sim_score >= 70 ? '#F0FDF4' : '#FFFBEB', borderRadius: '10px', padding: '10px 14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${post.sim_score >= 70 ? '#BBF7D0' : '#FDE68A'}` }}>
                <span style={{ fontSize: '20px' }}>🩺</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '12px', color: post.sim_score >= 70 ? '#166534' : '#92400E' }}>
                    ClinicalSim Score: {post.sim_score}%
                  </div>
                  {post.sim_scenario_title && <div style={{ fontSize: '11px', color: '#94A3B8' }}>{post.sim_scenario_title}</div>}
                </div>
              </div>
            )}

            {/* Content */}
            <p style={{ color: '#0A2540', fontSize: '14px', lineHeight: '1.6', margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>{post.content}</p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => toggleLike(post.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: likedPosts.has(post.id) ? '#F43F5E' : '#94A3B8', fontSize: '13px', fontWeight: '600', padding: 0 }}>
                <Heart size={16} fill={likedPosts.has(post.id) ? '#F43F5E' : 'none'} />
                {post.likes_count > 0 && post.likes_count}
              </button>
              <button onClick={() => toggleComments(post.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: expandedComments.has(post.id) ? '#4F46E5' : '#94A3B8', fontSize: '13px', fontWeight: '600', padding: 0 }}>
                <MessageCircle size={16} />
                {post.comments_count > 0 && post.comments_count}
              </button>
            </div>
          </div>

          {/* Comments section */}
          {expandedComments.has(post.id) && (
            <div style={{ borderTop: '1px solid #F8FAFC', padding: '12px 16px', background: '#FAFBFC' }}>
              {(comments[post.id] || []).map((comment, i) => (
                <div key={i} className="comment-item">
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                    {getInitials(comment.author?.full_name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '700', color: '#0A2540', fontSize: '12px' }}>{comment.author?.full_name?.split(' ')[0] || 'Nurse'}</span>
                      {comment.author?.career_goal && <span style={{ fontSize: '11px' }}>{GOAL_FLAGS[comment.author.career_goal]}</span>}
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{timeAgo(comment.created_at)}</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Comment input */}
              {user ? (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    value={newComments[post.id] || ''}
                    onChange={e => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                    placeholder="Write a comment..."
                    style={{ flex: 1, border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '9px 12px', fontSize: '13px', outline: 'none', color: '#0A2540', fontFamily: 'system-ui' }}
                  />
                  <button onClick={() => submitComment(post.id)}
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <Send size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/signin')}
                  style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  Sign in to comment
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  )

  // If not logged in, show without AppShell (public view)
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FC', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A2540, #1E3A5F)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icons/icon-64.png" alt="NursePassport Africa" style={{ width: "28px", height: "28px", borderRadius: "8px" }} />
            <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>NursePassport Africa</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/signin')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg, #F43F5E, #EC4899)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Join Free</button>
          </div>
        </div>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px' }}>
          {content}
        </div>
      </div>
    )
  }

  return <AppShell><div style={{ maxWidth: '640px', margin: '0 auto' }}>{content}</div></AppShell>
}
