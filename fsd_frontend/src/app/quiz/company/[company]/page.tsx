import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../../../../components/Navbar'
import { Sidebar } from '../../../../components/Sidebar'
import { SkeletonCard } from '../../../../components/LoadingSkeleton'
import api from '../../../../services/api'
import type { CompanyKit, CompanyProfile, RoleProfile } from '../../../../types/quiz'

export default function CompanyProfilePage() {
  const navigate = useNavigate()
  const { company: companyParam } = useParams()
  const location = useLocation()

  const selectedKit = (location.state as { kit?: CompanyKit } | null)?.kit
  const company = useMemo(() => decodeURIComponent(companyParam ?? ''), [companyParam])

  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>('')

  const loadProfile = useCallback(async () => {
    if (!company) return
    try {
      setLoading(true)
      setError(null)
      const response = await api.getCompanyProfile(company)
      setProfile(response)

      if (!selectedRoleTitle && response.roles.length) {
        setSelectedRoleTitle(response.roles[0].title)
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string }
      const message = errorObj?.response?.data?.message || errorObj?.message || 'Failed to load company profile'
      setError(message)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [company, selectedRoleTitle])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (!company) return
    const id = window.setInterval(() => {
      loadProfile()
    }, 60000)
    return () => window.clearInterval(id)
  }, [company, loadProfile])

  const selectedRole: RoleProfile | undefined = useMemo(() => {
    if (!profile) return undefined
    return profile.roles.find((r) => r.title === selectedRoleTitle) ?? profile.roles[0]
  }, [profile, selectedRoleTitle])

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <h1 style={{ marginBottom: 0 }}>{company || 'Company Profile'}</h1>
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
            </div>
            <p className="text-muted">Live roles, required subjects, and interview questions (auto-refreshes every 60s)</p>
          </div>

          {selectedKit && (
            <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <div>
                  <p className="text-muted" style={{ margin: 0 }}>From your kit</p>
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
            </div>
          )}

          {error && (
            <div style={{
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--accent-danger)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span><strong>Heads up:</strong> {error}</span>
                <button
                  onClick={loadProfile}
                  style={{
                    padding: 'var(--space-xs) var(--space-md)',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--accent-danger)',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && profile && (
            <>
              <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                  <div>
                    <p className="text-muted" style={{ margin: 0 }}>Last synced</p>
                    <strong>{new Date(profile.lastSynced).toLocaleString()}</strong>
                  </div>
                  <div style={{ minWidth: '280px' }}>
                    <p className="text-muted" style={{ margin: 0, marginBottom: 'var(--space-xs)' }}>Job role</p>
                    <select
                      value={selectedRoleTitle}
                      onChange={(e) => setSelectedRoleTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {profile.roles.map((role) => (
                        <option key={role.title} value={role.title}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {selectedRole && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
                  <section className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h2 style={{ marginTop: 0 }}>What to learn</h2>
                    <p className="text-muted" style={{ marginTop: '-8px' }}>Required subjects for this role</p>

                    <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                      {selectedRole.requiredSubjects.map((subject) => (
                        <span
                          key={subject}
                          style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            background: 'var(--bg-tertiary)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div>
                        <p className="text-muted" style={{ margin: 0 }}>Salary</p>
                        <strong>{selectedRole.salary || 'Not listed'}</strong>
                      </div>
                      {selectedRole.sourceUrl ? (
                        <a
                          href={selectedRole.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: 'var(--space-xs) var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--accent-primary)',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          View job source
                        </a>
                      ) : null}
                    </div>
                  </section>

                  <section className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h2 style={{ marginTop: 0 }}>Interview questions</h2>
                    <p className="text-muted" style={{ marginTop: '-8px' }}>Practice prompts aligned to the role</p>

                    <ol style={{ marginTop: 'var(--space-md)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {selectedRole.interviewQuestions.map((q) => (
                        <li key={q} style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{q}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
