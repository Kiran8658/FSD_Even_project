import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { SkeletonCard } from '../../components/LoadingSkeleton'
import api from '../../services/api'
import type { CompanyKitResponse } from '../../types/quiz'

export default function QuizPage() {
  const navigate = useNavigate()
  const [kitData, setKitData] = useState<CompanyKitResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadKits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getCompanyKits()
      setKitData(response)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load company kits'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadKits()
  }, [loadKits])

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1>Company Wise Kit</h1>
            <p className="text-muted">Personalized prep decks powered by your recent activity</p>
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-lg)',
              color: '#ef4444'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span><strong>Heads up:</strong> {error}</span>
                <button
                  onClick={loadKits}
                  style={{
                    padding: 'var(--space-xs) var(--space-md)',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: '#ef4444',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
              {[...Array(4)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          )}

          {!loading && kitData && (
            <>
              <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', justifyContent: 'space-between' }}>
                  <div>
                    <p className="text-muted" style={{ margin: 0 }}>Curated for</p>
                    <h2 style={{ margin: 0 }}>{kitData.username}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-muted" style={{ margin: 0 }}>Last synced</p>
                    <strong>{new Date(kitData.lastSynced).toLocaleString()}</strong>
                  </div>
                </div>
                {kitData.recommendedCompanies.length > 0 && (
                  <div style={{ marginTop: 'var(--space-lg)' }}>
                    <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Recommended focus</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                      {kitData.recommendedCompanies.map((company) => (
                        <span key={company} style={{
                          padding: 'var(--space-xs) var(--space-md)',
                          borderRadius: '999px',
                          background: 'rgba(14, 165, 233, 0.15)',
                          color: 'var(--accent-primary)',
                          fontWeight: 600,
                          fontSize: 'var(--font-size-sm)'
                        }}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                {kitData.kits.map((kit) => (
                  <div key={kit.id} className="card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{kit.company}</h3>
                      <span style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(14, 165, 233, 0.15)',
                        color: 'var(--accent-primary)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600
                      }}>
                        {kit.difficulty}
                      </span>
                    </div>
                    <p className="text-muted" style={{ margin: 0 }}>{kit.focusArea}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span>{kit.questionCount} questions</span>
                      <span>{kit.completionRate}% complete</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                      {kit.tags.map((tag) => (
                        <span key={tag} style={{
                          padding: '2px 10px',
                          borderRadius: '999px',
                          background: 'var(--bg-secondary)',
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--text-secondary)'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      <small className="text-muted">Updated {kit.lastUpdated}</small>
                      <button
                        onClick={() => navigate('/plan', { state: { company: kit.company } })}
                        style={{
                          padding: 'var(--space-xs) var(--space-md)',
                          background: 'var(--accent-primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        Open Workspace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !kitData && !error && (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <p style={{ fontSize: '3em', marginBottom: 'var(--space-lg)' }}>📭</p>
              <h2>No kits yet</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                We could not find any recommendations. Log some activity and refresh this page.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: 'var(--space-md) var(--space-xl)',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 600
                }}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
