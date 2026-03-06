import { useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { SkeletonLoader, SkeletonCard } from '../../components/LoadingSkeleton'
import { useWorkspaceData } from '../../hooks/useWorkspaceData'
import type { CompanyKit } from '../../types/quiz'

export default function PlanPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const selectedKit = (location.state as { kit?: CompanyKit } | null)?.kit
  const selectedCompany = selectedKit?.company ?? searchParams.get('company') ?? undefined

  const { stats, activities, skills, insights, loading, error } = useWorkspaceData({ activityDays: 10 })

  const focusAreas = useMemo(() => {
    if (!skills.length) return []
    return [...skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4)
      .map((skill) => ({
        ...skill,
        status:
          skill.level >= 80
            ? 'Polishing'
            : skill.level >= 55
              ? 'In motion'
              : 'Needs attention'
      }))
  }, [skills])

  const recentActivity = useMemo(() => activities.slice(-7).reverse(), [activities])

  const workspacePulse = useMemo(() => {
    if (!stats) return null
    const window = activities.slice(-7)
    const total = window.reduce((sum, day) => sum + day.count, 0)
    const avg = window.length ? (total / window.length).toFixed(1) : '0.0'
    return {
      total,
      avg,
      streak: stats.currentStreak,
      consistency: stats.consistencyRate
    }
  }, [activities, stats])

  const liveInsights = useMemo(() => insights.slice(0, 4), [insights])

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <h1 style={{ marginBottom: 0 }}>{selectedCompany ? `${selectedCompany} Workspace` : 'My Workspace'}</h1>
              {selectedCompany && (
                <button
                  onClick={() => navigate('/quiz')}
                  style={{
                    padding: 'var(--space-xs) var(--space-md)',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Back to Company Wise Kit
                </button>
              )}
            </div>
            <p className="text-muted">Live pulse across your streaks, focus areas, and insight stream</p>
          </div>

          {selectedKit && (
            <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <div>
                  <p className="text-muted" style={{ margin: 0 }}>Focus deck</p>
                  <h2 style={{ margin: 0 }}>{selectedKit.company}</h2>
                  <p className="text-muted" style={{ marginTop: 'var(--space-sm)', marginBottom: 0 }}>{selectedKit.focusArea}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(14, 165, 233, 0.15)',
                    color: 'var(--accent-primary)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600
                  }}>
                    {selectedKit.difficulty}
                  </span>
                  <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                    {selectedKit.questionCount} questions • {selectedKit.completionRate}% complete
                  </span>
                </div>
              </div>

              {selectedKit.tags?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                  {selectedKit.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        background: 'var(--bg-tertiary)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {error && (
            <div style={{
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444'
            }}>
              <strong>Workspace sync failed:</strong> {error}
            </div>
          )}

          {loading ? (
            <SkeletonLoader />
          ) : stats ? (
            <div className="grid cols-4" style={{ marginBottom: 'var(--space-2xl)' }}>
              <div className="card">
                <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Weekly Velocity</p>
                <div style={{ fontSize: '2em', fontWeight: 700 }}>{workspacePulse?.total ?? 0}</div>
                <span className="text-muted">activities in the last 7 days</span>
              </div>
              <div className="card">
                <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Avg. Daily Flow</p>
                <div style={{ fontSize: '2em', fontWeight: 700 }}>{workspacePulse?.avg ?? '0.0'}</div>
                <span className="text-muted">sessions / day</span>
              </div>
              <div className="card">
                <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Streak</p>
                <div style={{ fontSize: '2em', fontWeight: 700 }}>{stats.currentStreak} 🔥</div>
                <span className="text-muted">longest {stats.longestStreak} days</span>
              </div>
              <div className="card">
                <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Consistency</p>
                <div style={{ fontSize: '2em', fontWeight: 700 }}>{stats.consistencyRate}%</div>
                <span className="text-muted">rolling 30-day window</span>
              </div>
            </div>
          ) : null}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <section className="card" style={{ padding: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Focus Lanes</h2>
                  <p className="text-muted" style={{ margin: 0 }}>Top skills pulled directly from your graph</p>
                </div>
                <span style={{ fontSize: '2em' }}>🧠</span>
              </div>

              {loading ? (
                <SkeletonCard />
              ) : focusAreas.length ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
                  {focusAreas.map((skill) => (
                    <div key={skill.name} style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-lg)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                        <strong>{skill.name}</strong>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{skill.category}</span>
                      </div>
                      <div style={{
                        height: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        marginBottom: 'var(--space-sm)'
                      }}>
                          <div style={{
                            width: `${skill.level}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                          }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{skill.level}%</span>
                        <span style={{
                          fontSize: 'var(--font-size-xs)',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'rgba(14,165,233,0.12)',
                          color: 'var(--accent-primary)'
                        }}>
                          {skill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skill data yet. Log an activity to unlock recommendations.</p>
              )}
            </section>

            <section className="card" style={{ padding: 'var(--space-2xl)', minHeight: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Activity Radar</h3>
                  <p className="text-muted" style={{ margin: 0 }}>Newest sessions land here automatically</p>
                </div>
                <span style={{ fontSize: '1.5em' }}>📡</span>
              </div>

              {recentActivity.length ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {recentActivity.map((item) => (
                    <li key={item.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong>
                        <p className="text-muted" style={{ margin: 0 }}>Deep work burst</p>
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.count} pts</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recent activity. Add a session to start shaping this radar.</p>
              )}
            </section>
          </div>

          <section className="card" style={{ padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ margin: 0 }}>Live Insight Stream</h2>
                <p className="text-muted" style={{ margin: 0 }}>Auto-generated nudges from your recent behavior</p>
              </div>
              <span style={{ fontSize: '2em' }}>⚡</span>
            </div>

            {loading ? (
              <SkeletonCard />
            ) : liveInsights.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
                {liveInsights.map((insight) => (
                  <div key={insight.id} style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: 'var(--space-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{ fontSize: '1.5em' }}>{insight.icon}</span>
                      <div>
                        <strong>{insight.title}</strong>
                        <p className="text-muted" style={{ margin: 0 }}>{insight.timestamp}</p>
                      </div>
                    </div>
                    <p style={{ margin: 0 }}>{insight.description}</p>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{insight.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No insights yet. Consistent activity will unlock tailored suggestions.</p>
            )}
          </section>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          main .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
