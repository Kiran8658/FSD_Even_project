import { useEffect, useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import api from '../../../services/api'
import type { User } from '../../../types/dashboard'

const ICON_SIZE = 18

const SOCIAL_ICONS: Record<string, ReactNode> = {
  email: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 2-8 5-8-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 19h16a2 2 0 0 0 2-2V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  linkedin: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3zM10 9h3.8v1.71h.05c.53-1 1.82-2 3.75-2 4 0 4.75 2.4 4.75 5.51V21H19v-6.13c0-1.46-.03-3.34-2.03-3.34-2.03 0-2.35 1.58-2.35 3.23V21h-3.8Z"
        fill="currentColor"
      />
    </svg>
  ),
  twitter: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2H21l-6.356 7.271L22 22h-6.778l-4.771-6.244L4.9 22H2.14l6.815-7.8L2 2h6.889l4.27 5.6z"
        fill="currentColor"
      />
    </svg>
  ),
  website: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a12 12 0 0 1 3.5 8 12 12 0 0 1-3.5 8 12 12 0 0 1-3.5-8 12 12 0 0 1 3.5-8Zm-7.95 8a8 8 0 0 1 0-2h15.9a8 8 0 0 1 0 2Z"
        fill="currentColor"
      />
    </svg>
  ),
  resume: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M9 13h6M9 17h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ProfilePage() {
  const params = useParams<{ username?: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsExpanded, setStatsExpanded] = useState(true)
  const [addPlatformVisible, setAddPlatformVisible] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleVerificationClick = () => {
    navigate('/settings?section=verification')
  }

  const openExternalLink = (url?: string) => {
    if (!url) {
      showToast('Add this link from Settings to activate it.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const socialActions = user ? [
    {
      label: 'Email',
      icon: SOCIAL_ICONS.email,
      color: 'var(--text-primary)',
      onClick: () => {
        if (!user.email) {
          showToast('No email available yet.')
          return
        }
        window.location.href = `mailto:${user.email}`
      }
    },
    {
      label: 'LinkedIn',
      icon: SOCIAL_ICONS.linkedin,
      color: '#0A66C2',
      onClick: () => openExternalLink(user.links?.linkedIn)
    },
    {
      label: 'X / Twitter',
      icon: SOCIAL_ICONS.twitter,
      color: '#000000',
      onClick: () => openExternalLink(user.links?.twitter)
    },
    {
      label: 'Website',
      icon: SOCIAL_ICONS.website,
      color: 'var(--accent-primary)',
      onClick: () => openExternalLink(user.links?.website)
    },
    {
      label: 'Resume',
      icon: SOCIAL_ICONS.resume,
      color: '#F97316',
      onClick: () => openExternalLink(user.links?.resume)
    }
  ] : []

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const username = params.username
        
        if (!username) {
          setError('Username not provided')
          setLoading(false)
          return
        }

        const userData = await api.getUser(username)
        setUser(userData)
        setLoading(false)
      } catch (err) {
        setError('Failed to load profile')
        setLoading(false)
      }
    }

    loadProfile()
  }, [params.username])

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)', textAlign: 'center' }}>
          <p className="text-muted">Loading profile...</p>
        </main>
      </>
    )
  }

  if (error || !user) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)', textAlign: 'center' }}>
          <p className="text-muted">{error || 'User not found'}</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-2xl)' }}>
          
          {/* LEFT SIDEBAR - USER INFO */}
          <div>
            {/* Profile Card */}
            <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-lg) auto',
                fontSize: '3em',
                color: '#fff',
                fontWeight: 700
              }}>
                {(user.name || user.username).charAt(0).toUpperCase()}
              </div>
              
              {/* Name */}
              <h2 style={{ margin: '0 0 var(--space-xs) 0', fontSize: 'var(--font-size-xl)' }}>
                {user?.name || user?.username}
              </h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                @{user?.username}
              </p>

              {/* Get Badge Button */}
              <button
                onClick={handleVerificationClick}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'linear-gradient(135deg, #ff9800, #ff6f00)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                🏆 Get Verification
              </button>

              {/* Social Links */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'var(--space-sm)',
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-md)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}>
                {[
                  {
                    icon: <img src="https://cdn.simpleicons.org/linkedin/ffffff" alt="LinkedIn" width="20" height="20" style={{ display: 'block' }} />,
                    label: 'LinkedIn', bg: '#0A66C2', action: () => openExternalLink(user.links?.linkedIn)
                  },
                  {
                    icon: <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" width="20" height="20" style={{ display: 'block' }} />,
                    label: 'GitHub', bg: '#24292e', action: () => openExternalLink(user.links?.github)
                  },
                  {
                    icon: <img src="https://cdn.simpleicons.org/x/ffffff" alt="Twitter" width="20" height="20" style={{ display: 'block' }} />,
                    label: 'Twitter', bg: '#000000', action: () => openExternalLink(user.links?.twitter)
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    ),
                    label: 'Email', bg: '#2196F3', action: () => { window.location.href = `mailto:${user.email}` }
                  },
                  {
                    icon: <img src="https://cdn.simpleicons.org/googlechrome/ffffff" alt="Website" width="20" height="20" style={{ display: 'block' }} />,
                    label: 'Website', bg: '#4285F4', action: () => openExternalLink(user.links?.website)
                  },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <button
                      title={s.label}
                      onClick={s.action}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-lg)',
                        background: s.bg,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.18s',
                        padding: '0',
                        boxShadow: `0 2px 8px ${s.bg}66`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = `0 8px 20px ${s.bg}99`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = `0 2px 8px ${s.bg}66`
                      }}
                    >
                      {s.icon}
                    </button>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ margin: '0 0 var(--space-md) 0', fontSize: 'var(--font-size-sm)' }}>About</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {user.bio}
                </p>
              </div>
            )}

            {/* Problem Solving Stats */}
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 600 }}>Problem Solving Stats</h4>
                <span
                  onClick={() => setStatsExpanded(!statsExpanded)}
                  style={{ cursor: 'pointer', fontSize: '1.2em', transition: 'transform 0.2s', display: 'inline-block', transform: statsExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
                >
                  ▲
                </span>
              </div>
              
              {/* Platform Stats */}
              {statsExpanded && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  { name: 'LeetCode', color: '#FFA500', problems: 245 },
                  { name: 'CodeChef', color: '#8B4513', problems: 89 },
                  { name: 'CodeForces', color: '#1E90FF', problems: 34 },
                  { name: 'HackerRank', color: '#00B050', problems: 42 }
                ].map((platform) => (
                  <div key={platform.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--space-md)',
                    background: 'rgba(14, 165, 233, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.05)'}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: platform.color,
                      marginRight: 'var(--space-md)'
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
                        {platform.name}
                      </p>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {platform.problems}
                    </span>
                  </div>
                ))}
              </div>}

              {addPlatformVisible && (
                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(14,165,233,0.07)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Platform linking coming soon! Connect your LeetCode, CodeForces &amp; more from Settings.
                </div>
              )}
              <button
                onClick={() => { setAddPlatformVisible(!addPlatformVisible); navigate('/settings') }}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  background: 'rgba(14, 165, 233, 0.1)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14,165,233,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(14,165,233,0.1)'}
              >
                + Add Platform
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT - MAIN STATS */}
          <div>
            {/* Verification Banner */}
            <div style={{
              padding: 'var(--space-lg)',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-2xl)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
                  ✓ You aren't verified yet
                </p>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Get verified to unlock exclusive badges and rankings on leaderboards
                </p>
              </div>
              <button
                onClick={handleVerificationClick}
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  marginLeft: 'var(--space-lg)',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Verify Profile →
              </button>
            </div>

            {/* Key Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)'
            }}>
              {[
                { label: 'Total Questions', value: '655', subtext: 'Submissions' },
                { label: 'Total Active Days', value: '80', subtext: 'Max Streak: 11' },
                { label: 'Current Streak', value: '0', subtext: 'Days' },
                { label: 'Rank', value: '#10368', subtext: 'Weekly Rank' }
              ].map((stat, i) => (
                <div key={i} className="card" style={{ padding: 'var(--space-lg)' }}>
                  <p style={{ margin: '0 0 var(--space-md) 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {stat.label}
                  </p>
                  <h3 style={{ margin: 0, fontSize: '2em', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
                    {stat.value}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>

            {/* Activity Heatmap */}
            <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Activity</h3>
                <select style={{
                  background: 'rgba(14, 165, 233, 0.1)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-sm)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                  <option>Current</option>
                  <option>Last Month</option>
                  <option>Last Year</option>
                </select>
              </div>

              {/* Mini Calendar */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '2px', minWidth: '350px' }}>
                  {Array.from({ length: 14 * 7 }).map((_, i) => {
                    const intensity = Math.random() > 0.7 ? Math.random() > 0.5 ? 3 : 2 : Math.random() > 0.5 ? 1 : 0
                    const colors = ['transparent', 'rgba(76, 175, 80, 0.3)', 'rgba(76, 175, 80, 0.6)', 'rgba(76, 175, 80, 1)']
                    return (
                      <div key={i} style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: colors[intensity],
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }} />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Problems Solved Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
              {/* DSA */}
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ margin: '0 0 var(--space-lg) 0', fontSize: 'var(--font-size-base)', fontWeight: 600 }}>
                  Problems Solved - DSA
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { label: 'Easy', count: 4, color: '#4CAF50' },
                      { label: 'Medium', count: 1, color: '#FF9800' },
                      { label: 'Hard', count: 0, color: '#F44336' }
                    ].map((difficulty) => (
                      <div key={difficulty.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: difficulty.color, marginRight: 'var(--space-sm)' }} />
                          {difficulty.label}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                          {difficulty.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#4CAF50 0deg 144deg, #FF9800 144deg 158.4deg, #F44336 158.4deg 360deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2em',
                    fontWeight: 700
                  }}>
                    5
                  </div>
                </div>
              </div>

              {/* Competitive Programming */}
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ margin: '0 0 var(--space-lg) 0', fontSize: 'var(--font-size-base)', fontWeight: 600 }}>
                  Competitive Programming
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { name: 'CodeChef', rating: 436 },
                      { name: 'CodeForces', rating: 214 }
                    ].map((platform) => (
                      <div key={platform.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                          {platform.name}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                          {platform.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#FFC107 0deg 180deg, #4CAF50 180deg 360deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2em',
                    fontWeight: 700
                  }}>
                    650
                  </div>
                </div>
              </div>
            </div>

            {/* Contest Rankings */}
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ margin: '0 0 var(--space-lg) 0', fontSize: 'var(--font-size-base)', fontWeight: 600 }}>
                Contest Rankings
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-lg)'
              }}>
                {[
                  { platform: 'LeetCode', rank: '#4,521' },
                  { platform: 'CodeChef', rank: '#1,289' },
                  { platform: 'CodeForces', rank: '#8,456' }
                ].map((ranking) => (
                  <div key={ranking.platform} style={{
                    padding: 'var(--space-lg)',
                    background: 'rgba(14, 165, 233, 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                      {ranking.platform}
                    </p>
                    <p style={{ margin: 0, fontSize: '1.5em', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {ranking.rank}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-xl)',
          right: 'var(--space-xl)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--accent-primary)',
          color: 'var(--text-primary)',
          padding: 'var(--space-md) var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontSize: 'var(--font-size-sm)',
          maxWidth: '360px',
          animation: 'slideInRight 0.2s ease-out'
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
