import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

const TYPING_STRINGS = [
  'Track Coding Streaks',
  'Master New Skills',
  'Crush DSA Problems',
  'Stay Consistent',
  'Build Great Habits',
]

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Particle system for network effect
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
    }

    const particles: Particle[] = []
    const particleCount = 50
    const connectionDistance = 150

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'var(--bg-primary)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle
        ctx.fillStyle = '#A100FF'
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(161, 0, 255, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.globalAlpha = 1 - distance / connectionDistance
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Network Background Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundColor: 'var(--bg-primary)'
          }}
        />

        {/* Content Overlay */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Hero Section */}
          <section style={{
            paddingTop: 'var(--space-2xl)',
            paddingBottom: 'var(--space-2xl)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.95))',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="container md" style={{ textAlign: 'center' }}>
              <div className="fade-in">
                <div style={{
                  fontSize: '5em',
                  marginBottom: 'var(--space-lg)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}>
                  📊
                </div>
                <h1 style={{
                  fontSize: 'clamp(2.5em, 8vw, 4em)',
                  marginBottom: 'var(--space-md)',
                  background: 'linear-gradient(135deg, #A100FF, #D060FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700
                }}>
                  Track Your Learning Journey
                </h1>
                <p style={{
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-xl)',
                  maxWidth: '600px',
                  margin: '0 auto var(--space-xl) auto',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  GhostWrite helps developers maintain consistency, track skills, and celebrate milestones on their learning path. Stay motivated, build better habits.
                </p>
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 'var(--space-2xl)'
                }}>
                  <button className="primary" style={{
                    fontSize: 'var(--font-size-base)',
                    padding: 'var(--space-md) var(--space-xl)',
                    boxShadow: '0 0 30px rgba(161, 0, 255, 0.4)',
                    cursor: 'pointer'
                  }} onClick={() => navigate('/signup')}>
                    Get Started
                  </button>
                  <button style={{
                    fontSize: 'var(--font-size-base)',
                    padding: 'var(--space-md) var(--space-xl)',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(161, 0, 255, 0.1)',
                    border: '1px solid rgba(161, 0, 255, 0.3)',
                    cursor: 'pointer'
                  }} onClick={() => navigate('/signin')}>
                    Learn More
                  </button>
                </div>

                {/* Scroll indicator */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  marginTop: 'var(--space-2xl)',
                  animation: 'slideInUp 1s ease-out infinite'
                }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                    Scroll to explore
                  </p>
                  <div style={{
                    fontSize: '1.5em',
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>
                    ↓
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section style={{
            paddingTop: 'var(--space-2xl)',
            paddingBottom: 'var(--space-2xl)',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div className="container md">
              <h2 style={{
                textAlign: 'center',
                marginBottom: 'var(--space-2xl)',
                background: 'linear-gradient(135deg, #A100FF, #D060FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Why Choose GhostWrite?
              </h2>

              <div className="grid cols-3">
                {[
                  {
                    icon: '🔥',
                    title: 'Build Streaks',
                    description: 'Maintain consistent learning habits and watch your streak grow. Celebrate every milestone!'
                  },
                  {
                    icon: '📈',
                    title: 'Track Progress',
                    description: 'Visualize your learning activities with intuitive charts and detailed analytics.'
                  },
                  {
                    icon: '🎯',
                    title: 'Skill Mastery',
                    description: 'Monitor your skill development across categories and identify areas for growth.'
                  },
                  {
                    icon: '💡',
                    title: 'Get Insights',
                    description: 'Receive personalized tips, achievements, and recommendations to boost your learning.'
                  },
                  {
                    icon: '👥',
                    title: 'Share Progress',
                    description: 'Show off your achievements and inspire others in the developer community.'
                  },
                  {
                    icon: '🚀',
                    title: 'Stay Motivated',
                    description: 'Get rewarded for consistency and celebrate your growth along the journey.'
                  }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="card slide-in-up"
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(20, 20, 20, 0.7)',
                      borderColor: 'rgba(161, 0, 255, 0.15)'
                    }}
                  >
                    <div style={{ fontSize: '2em', marginBottom: 'var(--space-md)' }}>
                      {feature.icon}
                    </div>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>{feature.title}</h3>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(161, 0, 255, 0.08), rgba(123, 47, 190, 0.04))',
            borderTop: '1px solid rgba(161, 0, 255, 0.15)',
            borderBottom: '1px solid rgba(161, 0, 255, 0.15)',
            paddingTop: 'var(--space-2xl)',
            paddingBottom: 'var(--space-2xl)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="container md">
              <h2 style={{
                marginBottom: 'var(--space-lg)',
                color: 'var(--text-primary)'
              }}>
                Ready to Start Your Learning Journey?
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-lg)',
                marginBottom: 'var(--space-xl)',
                maxWidth: '500px',
                margin: '0 auto var(--space-xl) auto'
              }}>
                Join thousands of developers tracking their progress with GhostWrite.
              </p>
              <button className="primary" style={{
                fontSize: 'var(--font-size-base)',
                padding: 'var(--space-md) var(--space-xl)',
                boxShadow: '0 0 30px rgba(161, 0, 255, 0.4)',
                cursor: 'pointer'
              }} onClick={() => navigate('/signup')}>
                Start Free Today
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-xl)',
            paddingBottom: 'var(--space-xl)',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <div className="container md">
              <p style={{ margin: 0 }}>&copy; 2024 GhostWrite. Built with ❤️ for developers.</p>
            </div>
          </footer>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @media (max-width: 768px) {
            .grid.cols-3 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>
    </>
  )
}
