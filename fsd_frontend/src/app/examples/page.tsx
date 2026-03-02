import { useState, useEffect } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

interface LeaderboardEntry {
  rank: number
  username: string
  name: string
  avatar: string
  streak: number
  totalActivities: number
  score: number
  isCurrentUser: boolean
}

export default function ExamplesPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'streak' | 'activity'>('streak')

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const stats = await api.getDashboardStats()
        // Build leaderboard with current user + simulated peers
        const peers: LeaderboardEntry[] = [
          { rank: 1, username: 'code_master', name: 'Code Master', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster', streak: 45, totalActivities: 320, score: 0, isCurrentUser: false },
          { rank: 2, username: 'algo_queen', name: 'Algo Queen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=algoqueen', streak: 38, totalActivities: 280, score: 0, isCurrentUser: false },
          { rank: 3, username: 'dev_ninja', name: 'Dev Ninja', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devninja', streak: 30, totalActivities: 250, score: 0, isCurrentUser: false },
          { rank: 0, username: user?.username || 'you', name: user?.name || 'You', avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', streak: stats.currentStreak, totalActivities: stats.totalActivities, score: 0, isCurrentUser: true },
          { rank: 5, username: 'byte_wizard', name: 'Byte Wizard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bytewizard', streak: 20, totalActivities: 180, score: 0, isCurrentUser: false },
          { rank: 6, username: 'stack_overflow', name: 'Stack Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stackpro', streak: 15, totalActivities: 140, score: 0, isCurrentUser: false },
          { rank: 7, username: 'react_fan', name: 'React Fan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reactfan', streak: 10, totalActivities: 95, score: 0, isCurrentUser: false },
        ]
        setEntries(peers)
      } catch {
        setEntries([])
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [user])

  const sorted = [...entries]
    .sort((a, b) => tab === 'streak' ? b.streak - a.streak : b.totalActivities - a.totalActivities)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  const medals = ['🥇', '🥈', '🥉']

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ margin: '0 0 4px' }}>Leaderboard</h1>
            <p className="text-muted">See how you stack up against the community.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {(['streak', 'activity'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                  background: tab === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: tab === t ? '#fff' : 'var(--text-secondary)', fontWeight: 600,
                  cursor: 'pointer', fontSize: 'var(--font-size-sm)', textTransform: 'capitalize'
                }}
              >{t === 'streak' ? '🔥 By Streak' : '📊 By Activity'}</button>
            ))}
          </div>

          {loading ? (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <p className="text-muted">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {sorted.map((entry, idx) => (
                <div
                  key={entry.username}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                    borderBottom: idx < sorted.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    background: entry.isCurrentUser ? 'rgba(14,165,233,0.08)' : 'transparent'
                  }}
                >
                  <span style={{ width: '36px', textAlign: 'center', fontSize: entry.rank <= 3 ? '1.4rem' : 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <img src={entry.avatar} alt={entry.name} style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {entry.name} {entry.isCurrentUser && <span style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>(You)</span>}
                    </span>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)' }}>@{entry.username}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: tab === 'streak' ? '#f59e0b' : 'var(--accent-primary)' }}>
                      {tab === 'streak' ? `🔥 ${entry.streak}` : `${entry.totalActivities}`}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {tab === 'streak' ? 'day streak' : 'activities'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
