import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import { SettingsSidebar } from '../../../components/SettingsSidebar'

export default function AccountsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const handleLogout = () => { signOut(); navigate('/') }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '0', minHeight: 'calc(100vh - 70px)' }}>
          <SettingsSidebar />

          <div style={{ flex: 1, paddingLeft: '48px', paddingTop: '8px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>Accounts</h2>
            <p style={{ margin: '0 0 28px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Manage your account security and preferences.</p>

            {/* Account Info */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}>Account Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Username', value: `@${user?.username}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}>Change Password</h4>
              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label} style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <button
                onClick={() => showToast('Password updated!')}
                style={{ padding: '9px 22px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
              >Update Password</button>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ padding: '20px', border: '1px solid rgba(255,68,68,0.3)' }}>
              <h4 style={{ margin: '0 0 16px', fontWeight: 700, color: '#ff4444' }}>Danger Zone</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleLogout}
                  style={{ padding: '9px 22px', background: '#ff4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >Log Out</button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ padding: '9px 22px', background: 'none', border: '1px solid #ff4444', borderRadius: '8px', color: '#ff4444', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                >Delete Account</button>
              </div>

              {showDeleteConfirm && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(255,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(255,68,68,0.3)' }}>
                  <p style={{ margin: '0 0 12px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Are you sure? This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { showToast('Account deletion is not available yet.'); setShowDeleteConfirm(false) }} style={{ padding: '8px 18px', background: '#ff4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>Yes, Delete</button>
                    <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '8px 18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {toast && (
          <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: 'var(--font-size-sm)', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999 }}>{toast}</div>
        )}
      </main>
    </>
  )
}
