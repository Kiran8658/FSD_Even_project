import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Navbar } from '../../components/Navbar'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      await signUp(formData.name, formData.email, formData.password)
      // Success - redirect to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = err.message || 'Sign up failed. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  }

  const handleSignIn = () => {
    navigate('/signin')
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
          radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(2, 132, 199, 0.05) 0%, transparent 50%)
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
              Join GhostWrite
            </h1>
            <p className="text-muted" style={{ margin: 0 }}>
              Start tracking your learning journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} style={{ marginBottom: 'var(--space-lg)' }}>
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-sm)',
                fontWeight: 500,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-sm)',
                fontWeight: 500,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Terms */}
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            marginBottom: 'var(--space-lg)',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <p style={{ margin: '0 0 var(--space-md) 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Already have an account?
            </p>
            <button
              onClick={handleSignIn}
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
              Sign in here
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
