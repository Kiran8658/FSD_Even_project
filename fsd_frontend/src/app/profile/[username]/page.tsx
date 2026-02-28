import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import api from '../../../services/api'
import type { User } from '../../../types/dashboard'

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
                onClick={() => showToast('Verification request submitted! We\'ll review your profile shortly.')}
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
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
                {[
                  { icon: '✉️', label: 'Email' },
                  { icon: '💼', label: 'LinkedIn' },
                  { icon: '𝕏', label: 'X / Twitter' },
                  { icon: '🌐', label: 'Website' },
                  { icon: '📋', label: 'Resume' }
                ].map((s, i) => (
                  <button
                    key={i}
                    title={s.label}
                    onClick={() => showToast(`${s.label} link not set yet. Edit your profile to add it.`)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(14, 165, 233, 0.1)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                      cursor: 'pointer',
                      fontSize: '1.2em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(14,165,233,0.25)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(14,165,233,0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {s.icon}
                  </button>
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
                onClick={() => showToast('Verification request submitted! Check your email for next steps.')}
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
