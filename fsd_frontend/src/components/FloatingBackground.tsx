import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

interface FloatingBackgroundProps {
  particleCount?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export function FloatingBackground({ particleCount = 80 }: FloatingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const createParticles = (): Particle[] =>
      Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      }))

    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = createParticles()
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const isDark = theme === 'dark'
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dotColor = isDark ? 'rgba(125, 211, 252, 0.7)' : 'rgba(56, 189, 248, 0.5)'
      const lineBase = isDark ? 'rgba(14, 165, 233,' : 'rgba(56, 189, 248,'

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.fillStyle = dotColor
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.strokeStyle = lineBase + (0.18 * (1 - dist / 160)).toFixed(2) + ')'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [particleCount, theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9
      }}
    />
  )
}
