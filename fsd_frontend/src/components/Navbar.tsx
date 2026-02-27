import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import '../App.css'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const navLink = (path: string, label: string) => (
    <a
      onClick={() => navigate(path)}
      style={{
        color: 'var(--text-secondary)',
        transition: 'color var(--transition-fast)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
    >
      {label}
    </a>
  )

  const handleLogout = () => {
    signOut()
    navigate('/')
    setIsProfileOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5em',
            fontWeight: 'bold'
          }}>
            GW
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>GhostWrite</h1>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
          {isAuthenticated && (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink(`/profile/${user?.username}`, 'Profile')}
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(161, 0, 255, 0.1)',
              border: '1px solid rgba(161, 0, 255, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-sm) var(--space-md)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.2em',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.3)'
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'rgba(161, 0, 255, 0.1)',
                  border: '1px solid rgba(161, 0, 255, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(161, 0, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(161, 0, 255, 0.3)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8em'
                }}>
                  👤
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                  {user?.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 'var(--space-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    minWidth: '200px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: 'var(--space-md)' }}>
                    <p style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {user?.email}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-sm)' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm) var(--space-md)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-danger)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        transition: 'color var(--transition-fast)',
                        borderRadius: 'var(--radius-md)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 23, 68, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="primary" style={{ marginLeft: 'var(--space-md)' }} onClick={() => navigate('/signin')}>Sign In</button>
              <button style={{
                background: 'transparent',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                padding: 'var(--space-sm) var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 500
              }} onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.5em',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          display: 'none',
          padding: 'var(--space-xl)',
          borderTop: '1px solid var(--border-subtle)',
          flexDirection: 'column',
          gap: 'var(--space-md)'
        }} className="mobile-menu">
          {isAuthenticated && (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink(`/profile/${user?.username}`, 'Profile')}
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-danger)',
                cursor: 'pointer',
                fontWeight: 600,
                padding: 'var(--space-md) 0',
                textAlign: 'left'
              }}
            >
              Sign Out
            </button>
          ) : (
            <>
              <button className="primary" onClick={() => navigate('/signin')}>Sign In</button>
              <button style={{
                background: 'transparent',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 500
              }} onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(16px);
          background-color: rgba(10, 10, 10, 0.85);
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}
