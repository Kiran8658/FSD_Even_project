import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import { SettingsSidebar } from '../../../components/SettingsSidebar'
import api from '../../../services/api'

export default function BasicInfoPage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    college: (user as any)?.college || '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProfile({
        name: form.name,
        college: form.college,
      })
      updateUser(updated)
      showToast('Basic info saved!')
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
            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>Basic Info</h2>
            <p style={{ margin: '0 0 32px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Update your personal information.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input style={inputStyle} value={form.username} disabled placeholder="@username" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} value={form.email} disabled placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label style={labelStyle}>College / University</label>
                <input style={inputStyle} value={form.college} onChange={e => setForm(p => ({ ...p, college: e.target.value }))} placeholder="e.g. KLH University" />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 28px', background: 'var(--accent-primary)', border: 'none',
                borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer',
                fontSize: 'var(--font-size-sm)', transition: 'opacity 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Save Changes</button>
          </div>
        </div>

        {toast && (
          <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: 'var(--font-size-sm)', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999 }}>{toast}</div>
        )}
      </main>
    </>
  )
}
