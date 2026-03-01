import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Basic Info', path: '/settings/basic-info' },
  { label: 'Profile Details', path: '/settings/profile-details' },
  { label: 'Platform', path: '/settings/platforms' },
  { label: 'Visibility', path: '/settings/visibility' },
  { label: 'Accounts', path: '/settings/accounts' },
]

export function SettingsSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div style={{
      width: '220px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)',
      paddingTop: '8px'
    }}>
      <button
        onClick={() => navigate(`/profile/${user?.username}`)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)', marginBottom: '12px',
          width: '100%', textAlign: 'left'
        }}
      >← Back to Profile</button>

      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 16px', width: '100%', textAlign: 'left',
              background: isActive ? 'rgba(14,165,233,0.12)' : 'none',
              border: 'none', cursor: 'pointer',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
              fontSize: 'var(--font-size-sm)', transition: 'background 0.15s',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(14,165,233,0.06)' }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'none' }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
