import { useMemo } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { SkeletonCard } from '../../components/LoadingSkeleton'
import { useWorkspaceData } from '../../hooks/useWorkspaceData'

export default function ImpactAssessmentPage() {
  const { stats, activities, skills, insights, loading, error } = useWorkspaceData({ activityDays: 14 })

  const sheetRecommendations = useMemo(() => {
    if (!skills.length) return []
    return skills
      .map((skill, index) => ({
        id: `${skill.name}-${index}`,
        title: `${skill.name} Depth Sheet`,
        focus: skill.category,
        completion: skill.level,
        gap: Math.max(0, 100 - skill.level),
        priority: skill.level < 40 ? 'Critical' : skill.level < 70 ? 'Growth' : 'Refresh'
      }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5)
  }, [skills])

  const assessmentMetrics = useMemo(() => {
    if (!stats) return null
    const recent = activities.slice(-14)
    const total = recent.reduce((sum, activity) => sum + activity.count, 0)
    const avg = recent.length ? Math.round(total / recent.length) : 0
    return {
      throughput: total,
      avgPerDay: avg,
      consistency: stats.consistencyRate,
      streak: stats.currentStreak
    }
  }, [activities, stats])

  const priorityInsights = useMemo(() => insights.filter((insight) => insight.type !== 'tip').slice(0, 3), [insights])

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1>Explore Sheets</h1>
            <p className="text-muted">Live recommendations built from your current gaps</p>
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444'
            }}>
              <strong>Unable to score impact:</strong> {error}
            </div>
          )}

          <section className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ margin: 0 }}>Current Impact Pulse</h2>
                <p className="text-muted" style={{ margin: 0 }}>Rolling 14-day signal</p>
              </div>
              <span style={{ fontSize: '2em' }}>📈</span>
            </div>

            {loading || !assessmentMetrics ? (
              <SkeletonCard />
            ) : (
              <div className="grid cols-4">
                <div>
                  <p className="text-muted">Throughput</p>
                  <strong style={{ fontSize: '1.8em' }}>{assessmentMetrics.throughput}</strong>
                  <p className="text-muted" style={{ marginTop: 'var(--space-xs)' }}>actions in 14 days</p>
                </div>
                <div>
                  <p className="text-muted">Avg / day</p>
                  <strong style={{ fontSize: '1.8em' }}>{assessmentMetrics.avgPerDay}</strong>
                  <p className="text-muted" style={{ marginTop: 'var(--space-xs)' }}>steady cadence</p>
                </div>
                <div>
                  <p className="text-muted">Consistency</p>
                  <strong style={{ fontSize: '1.8em' }}>{assessmentMetrics.consistency}%</strong>
                  <p className="text-muted" style={{ marginTop: 'var(--space-xs)' }}>rolling 30-day</p>
                </div>
                <div>
                  <p className="text-muted">Active streak</p>
                  <strong style={{ fontSize: '1.8em' }}>{assessmentMetrics.streak} 🔥</strong>
                  <p className="text-muted" style={{ marginTop: 'var(--space-xs)' }}>current run</p>
                </div>
              </div>
            )}
          </section>

          <section className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ margin: 0 }}>Recommended Sheets</h2>
                <p className="text-muted" style={{ margin: 0 }}>Generated from live skill gaps</p>
              </div>
              <span style={{ fontSize: '2em' }}>🗂️</span>
            </div>

            {loading ? (
              <SkeletonCard />
            ) : sheetRecommendations.length ? (
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {sheetRecommendations.map((sheet) => (
                  <div key={sheet.id} style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-lg)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: 'var(--space-lg)'
                  }}>
                    <div>
                      <strong style={{ fontSize: '1.1em' }}>{sheet.title}</strong>
                      <p className="text-muted" style={{ margin: 'var(--space-xs) 0' }}>{sheet.focus} focus</p>
                      <div style={{
                        height: '6px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${sheet.completion}%`,
                          height: '100%',
                          background: 'var(--accent-primary)'
                        }} />
                      </div>
                      <small style={{ color: 'var(--text-tertiary)' }}>Progress {sheet.completion}%</small>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', alignItems: 'flex-end' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        color: 'var(--accent-primary)',
                        fontWeight: 600
                      }}>
                        {sheet.priority}
                      </span>
                      <span style={{ fontSize: '2em' }}>📄</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Gap: {sheet.gap}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No skill data yet. Complete dashboard onboarding to unlock curated sheets.</p>
            )}
          </section>

          <section className="card" style={{ padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ margin: 0 }}>Impact Notes</h2>
                <p className="text-muted" style={{ margin: 0 }}>High-signal insights to review</p>
              </div>
              <span style={{ fontSize: '2em' }}>🧭</span>
            </div>

            {loading ? (
              <SkeletonCard />
            ) : priorityInsights.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
                {priorityInsights.map((insight) => (
                  <div key={insight.id} style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: 'var(--space-lg)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{ fontSize: '1.5em' }}>{insight.icon}</span>
                      <div>
                        <strong>{insight.title}</strong>
                        <p className="text-muted" style={{ margin: 0 }}>{insight.timestamp}</p>
                      </div>
                    </div>
                    <p style={{ marginTop: 'var(--space-md)' }}>{insight.description}</p>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{insight.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No high-priority notes right now. Keep logging sessions to surface more guidance.</p>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
