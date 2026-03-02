import { useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

export default function ImpactEffortPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ category: 'feature', subject: '', message: '', rating: 0 })
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const handleSubmit = () => {
    if (!form.subject.trim() || !form.message.trim()) { showToast('Please fill in all fields.'); return }
    // Save feedback locally
    const feedbackList = JSON.parse(localStorage.getItem('fedf_feedback') || '[]')
    feedbackList.push({ ...form, user: user?.username, timestamp: new Date().toISOString() })
    localStorage.setItem('fedf_feedback', JSON.stringify(feedbackList))
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)',
    color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ margin: '0 0 4px' }}>Feedback</h1>
            <p className="text-muted">Help us improve by sharing your thoughts and suggestions.</p>
          </div>

          {submitted ? (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <p style={{ fontSize: '3em', marginBottom: 'var(--space-md)' }}>🎉</p>
              <h2 style={{ margin: '0 0 8px' }}>Thank you!</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>Your feedback has been recorded. We appreciate your input!</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ category: 'feature', subject: '', message: '', rating: 0 }) }}
                style={{ padding: '10px 28px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
              >Submit Another</button>
            </div>
          ) : (
            <div className="card" style={{ padding: '28px' }}>
              {/* Category */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'feature', label: '✨ Feature Request' },
                    { key: 'bug', label: '🐛 Bug Report' },
                    { key: 'improvement', label: '💡 Improvement' },
                    { key: 'other', label: '💬 Other' },
                  ].map(c => (
                    <button
                      key={c.key}
                      onClick={() => setForm(p => ({ ...p, category: c.key }))}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 500,
                        border: '1px solid var(--border-subtle)',
                        background: form.category === c.key ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: form.category === c.key ? '#fff' : 'var(--text-secondary)'
                      }}
                    >{c.label}</button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>How would you rate your experience?</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setForm(p => ({ ...p, rating: star }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', filter: star <= form.rating ? 'none' : 'grayscale(1) opacity(0.4)' }}
                    >⭐</button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Subject</label>
                <input style={inputStyle} value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief summary..." />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Describe your feedback in detail..." />
              </div>

              <button
                onClick={handleSubmit}
                style={{ padding: '10px 28px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Submit Feedback</button>
            </div>
          )}
        </div>

        {toast && (
          <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: 'var(--font-size-sm)', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999 }}>{toast}</div>
        )}
      </main>
    </>
  )
}
