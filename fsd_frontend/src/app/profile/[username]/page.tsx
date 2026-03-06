import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import api from '../../../services/api'
import type { User, PlatformStatsSummary, PlatformStat } from '../../../types/dashboard'

export default function ProfilePage() {
  const params = useParams<{ username?: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsExpanded, setStatsExpanded] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [platformStats, setPlatformStats] = useState<PlatformStatsSummary | null>(null)
  const [platformStatsLoading, setPlatformStatsLoading] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleVerificationClick = () => {
    navigate('/settings/profile-details')
  }

  const openExternalLink = (url?: string) => {
    if (!url) {
      showToast('Add this link from Settings to activate it.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

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

        setPlatformStatsLoading(true)
        try {
          const stats = await api.getPlatformStats(username)
          setPlatformStats(stats)
        } catch {
          setPlatformStats(null)
        } finally {
          setPlatformStatsLoading(false)
        }

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

  const getSolved = (key: string): number | null => {
    const stat = platformStats?.platforms?.[key]
    if (!stat) return null
    return typeof stat.solved === 'number' ? stat.solved : null
  }

  const normalizeProfileUrl = (link: string | undefined, prefix: string, home: string) => {
    if (!link) return home
    const trimmed = link.trim()
    if (!trimmed) return home
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    return prefix + trimmed.replace(/^\/+/, '')
  }

  const platformRow = (name: string, icon: string, key: string, fallbackUrl: string) => {
    const stat: PlatformStat | undefined = platformStats?.platforms?.[key]
    const solved = getSolved(key)
    const url = stat?.profileUrl || fallbackUrl

    const value = platformStatsLoading ? '…' : (solved == null ? '-' : String(solved))
    const disabled = !url

    return (
      <div key={key} style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-md)',
        background: 'rgba(14, 165, 233, 0.05)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1
      }}
      onClick={() => {
        if (!url) {
          showToast('Add this platform in Settings to activate it.')
          return
        }
        window.open(url, '_blank', 'noopener,noreferrer')
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(14, 165, 233, 0.05)' }}>
        <img src={icon} alt={name} width="26" height="26" style={{ marginRight: 'var(--space-md)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
            {name}
          </p>
          {stat?.error && (
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {stat.error}
            </p>
          )}
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>
          {value}
        </span>
      </div>
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
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-sm)',
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-md)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}>
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
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
                  platformRow(
                    'LeetCode',
                    'https://cdn.simpleicons.org/leetcode/FFA116',
                    'leetcode',
                    normalizeProfileUrl(user.links?.leetCode, 'https://leetcode.com/u/', 'https://leetcode.com')
                  ),
                  platformRow(
                    'CodeChef',
                    'https://cdn.simpleicons.org/codechef/5B4638',
                    'codechef',
                    normalizeProfileUrl(user.links?.codeChef, 'https://www.codechef.com/users/', 'https://www.codechef.com')
                  ),
                  platformRow(
                    'CodeForces',
                    'https://cdn.simpleicons.org/codeforces/1F8ACB',
                    'codeforces',
                    normalizeProfileUrl(user.links?.codeForces, 'https://codeforces.com/profile/', 'https://codeforces.com')
                  ),
                  platformRow(
                    'HackerRank',
                    'https://cdn.simpleicons.org/hackerrank/2EC866',
                    'hackerrank',
                    normalizeProfileUrl(user.links?.hackerRank, 'https://www.hackerrank.com/profile/', 'https://www.hackerrank.com')
                  )
                ]}
              </div>}

              <button
                onClick={() => navigate('/settings/platforms')}
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
                { label: 'Total Questions', value: platformStatsLoading ? '…' : String(platformStats?.totalSolved ?? 0), subtext: 'Solved across platforms' },
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
