import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import { SettingsSidebar } from '../../../components/SettingsSidebar'
import api from '../../../services/api'

export default function ProfileDetailsPage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    bio: (user as any)?.bio || '',
    college: (user as any)?.college || '',
    website: user?.links?.website || '',
    linkedin: user?.links?.linkedIn || '',
    github: user?.links?.github || '',
    twitter: user?.links?.twitter || '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProfile({
        bio: form.bio,
        college: form.college,
        links: {
          linkedIn: form.linkedin,
          github: form.github,
          twitter: form.twitter,
          website: form.website,
        }
      })
      updateUser(updated)
      showToast('Profile details saved!')
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)',
    color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', outline: 'none',
    boxSizing: 'border-box' as const
  }
  const labelStyle = { fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '0', minHeight: 'calc(100vh - 70px)' }}>
          <SettingsSidebar />

          <div style={{ flex: 1, paddingLeft: '48px', paddingTop: '8px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>Profile Details</h2>
            <p style={{ margin: '0 0 28px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Customize how your profile appears to others.</p>

            <h4 style={{ margin: '0 0 14px', fontWeight: 700 }}>About</h4>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell people about yourself..."
              />
            </div>

            <h4 style={{ margin: '0 0 14px', fontWeight: 700 }}>Education</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>College / University</label>
                <input style={inputStyle} value={form.college} onChange={e => setForm(p => ({ ...p, college: e.target.value }))} placeholder="e.g. IIT Bombay" />
              </div>
            </div>

            <h4 style={{ margin: '0 0 14px', fontWeight: 700 }}>Social Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={labelStyle}>LinkedIn</label>
                <input style={inputStyle} value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label style={labelStyle}>GitHub</label>
                <input style={inputStyle} value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} placeholder="https://github.com/username" />
              </div>
              <div>
                <label style={labelStyle}>Twitter / X</label>
                <input style={inputStyle} value={form.twitter} onChange={e => setForm(p => ({ ...p, twitter: e.target.value }))} placeholder="https://x.com/username" />
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <input style={inputStyle} value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yourwebsite.com" />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '10px 28px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)', transition: 'opacity 0.15s', opacity: saving ? 0.6 : 1 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>

        {toast && (
          <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: 'var(--font-size-sm)', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999 }}>{toast}</div>
        )}
      </main>
    </>
  )
}
