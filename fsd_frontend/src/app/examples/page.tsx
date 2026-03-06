import { useState, useEffect } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import type { PlatformLeaderboardEntry, PlatformLeaderboardMetric } from '../../types/leaderboard'

type LeaderboardEntry = PlatformLeaderboardEntry & {
  name: string
  avatar: string
  isCurrentUser: boolean
}

const METRICS: Array<{ key: PlatformLeaderboardMetric; label: string; valueLabel: string; valuePrefix?: string }> = [
  { key: 'cscore', label: '⚡ C Score', valueLabel: 'score', valuePrefix: '⚡ ' },
  { key: 'totalSolved', label: '📚 Total Questions', valueLabel: 'solved' },
  { key: 'leetcode', label: '🟧 LeetCode', valueLabel: 'solved' },
  { key: 'codeforces', label: '🟥 Codeforces', valueLabel: 'solved' },
  { key: 'codechef', label: '🟫 CodeChef', valueLabel: 'solved' },
]

export default function ExamplesPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<PlatformLeaderboardMetric>('cscore')

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const raw = await api.getPlatformLeaderboard(metric, 20, user?.username)
        const mapped: LeaderboardEntry[] = raw
          .map((e) => ({
            ...e,
            name: e.name ?? e.username,
            avatar: e.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(e.username)}`,
            isCurrentUser: !!user?.username && e.username.toLowerCase() === user.username.toLowerCase(),
          }))
          .sort((a, b) => a.rank - b.rank)

        setEntries(mapped)
      } catch {
        setEntries([])
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [user?.username, metric])

  const activeMetric = METRICS.find(m => m.key === metric) ?? METRICS[0]

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
            {METRICS.map(t => (
              <button
                key={t.key}
                onClick={() => setMetric(t.key)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                  background: metric === t.key ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: metric === t.key ? '#fff' : 'var(--text-secondary)', fontWeight: 600,
                  cursor: 'pointer', fontSize: 'var(--font-size-sm)', textTransform: 'capitalize'
                }}
              >{t.label}</button>
            ))}
          </div>

          {loading ? (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <p className="text-muted">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {entries.map((entry, idx) => (
                <div
                  key={entry.username}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                    borderBottom: idx < entries.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: metric === 'totalSolved' ? '#f59e0b' : 'var(--accent-primary)' }}>
                      {activeMetric.valuePrefix ?? ''}{entry.value}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {activeMetric.valueLabel}
                    </span>

                    {(metric === 'leetcode' || metric === 'codechef' || metric === 'codeforces') && entry.platform?.globalRank != null && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Global rank: #{entry.platform.globalRank}
                      </span>
                    )}

                    {(metric === 'codeforces') && entry.platform?.rating != null && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Rating: {entry.platform.rating}{entry.platform.rankText ? ` (${entry.platform.rankText})` : ''}
                      </span>
                    )}

                    {(metric === 'leetcode' || metric === 'codechef' || metric === 'codeforces') && entry.platform?.contests != null && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Tests: {entry.platform.contests}
                      </span>
                    )}
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
