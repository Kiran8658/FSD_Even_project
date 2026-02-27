import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Navbar } from '../../components/Navbar'

export default function SignInPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email')
        setLoading(false)
        return
      }

      await signIn(email, password)
      // Success - redirect to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = err.message || 'Sign in failed. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signIn('demo@ghostwrite.io', 'demo123')
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = err.message || 'Demo login failed. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        background: 'var(--bg-primary)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(2, 132, 199, 0.06) 0%, transparent 50%)
        `
      }}>
        <div className="card elevated" style={{
          width: '100%',
          maxWidth: '450px',
          background: 'var(--bg-secondary)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(14, 165, 233, 0.2)'
        }}>
          {/* Header */}
          <div style={{
            marginBottom: 'var(--space-xl)',
            textAlign: 'center',
            paddingBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2em',
              margin: '0 auto var(--space-md) auto'
            }}>
              📊
            </div>
            <h1 style={{
              margin: '0 0 var(--space-xs) 0',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 700
            }}>
              Welcome Back
            </h1>
            <p className="text-muted" style={{ margin: 0 }}>
              Sign in to your GhostWrite account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} style={{ marginBottom: 'var(--space-lg)' }}>
            {error && (
              <div style={{
                padding: 'var(--space-md)',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-lg)',
                color: 'var(--accent-danger)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-sm)',
                fontWeight: 500,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family-base)',
                  boxSizing: 'border-box',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-sm)'
              }}>
                <label style={{
                  fontWeight: 500,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-primary)'
                }}>
                  Password
                </label>
                <a style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-family-base)',
                  boxSizing: 'border-box',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary"
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all var(--transition-fast)',
                background: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              or
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)'
            }}
          >
            Try Demo Account
          </button>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <p style={{ margin: '0 0 var(--space-md) 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Don't have an account?
            </p>
            <button
              onClick={handleSignUp}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Create an account
            </button>
          </div>
        </div>
      </main>

      <style>{`
        input::placeholder {
          color: var(--text-tertiary);
        }

        @media (max-width: 480px) {
          .card {
            padding: var(--space-lg) !important;
          }
        }
      `}</style>
    </>
  )
}
