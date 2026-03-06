import { useState } from 'react'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import { SettingsSidebar } from '../../../components/SettingsSidebar'

const defaultSettings = {
    profilePublic: true,
    showEmail: false,
    showActivity: true,
    showStreak: true,
    showSkills: true,
    showAchievements: true,
    showPlatformStats: true,
  }

type VisibilitySettings = typeof defaultSettings

export default function VisibilityPage() {
  const [settings, setSettings] = useState<VisibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('fedf_visibility')
      if (!saved) return defaultSettings
      const parsed = JSON.parse(saved) as Partial<VisibilitySettings>
      return { ...defaultSettings, ...parsed }
    } catch {
      return defaultSettings
    }
  })
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const toggle = (key: keyof VisibilitySettings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))

  const ToggleRow = ({ label, desc, k }: { label: string; desc: string; k: keyof VisibilitySettings }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{label}</p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>{desc}</p>
      </div>
      <div
        onClick={() => toggle(k)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
          background: settings[k] ? 'var(--accent-primary)' : 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)', position: 'relative', transition: 'background 0.2s', flexShrink: 0
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '2px', transition: 'left 0.2s',
          left: settings[k] ? '22px' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '0', minHeight: 'calc(100vh - 70px)' }}>
          <SettingsSidebar />

          <div style={{ flex: 1, paddingLeft: '48px', paddingTop: '8px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>Visibility</h2>
            <p style={{ margin: '0 0 28px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Control what others can see on your profile.</p>

            <div className="card" style={{ padding: '0 20px' }}>
              <ToggleRow label="Public Profile" desc="Allow anyone to view your profile" k="profilePublic" />
              <ToggleRow label="Show Email" desc="Display your email address on your profile" k="showEmail" />
              <ToggleRow label="Show Activity" desc="Show your activity heatmap and contributions" k="showActivity" />
              <ToggleRow label="Show Streak" desc="Display your current and longest streak" k="showStreak" />
              <ToggleRow label="Show Skills" desc="Show your skills and proficiency levels" k="showSkills" />
              <ToggleRow label="Show Achievements" desc="Display your earned badges and achievements" k="showAchievements" />
              <ToggleRow label="Show Platform Stats" desc="Show your LeetCode, CodeForces and other stats" k="showPlatformStats" />
            </div>

            <button
              onClick={() => {
                try {
                  localStorage.setItem('fedf_visibility', JSON.stringify(settings))
                } catch {
                  // ignore storage errors
                }
                showToast('Visibility settings saved!')
              }}
              style={{ marginTop: '24px', padding: '10px 28px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
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
