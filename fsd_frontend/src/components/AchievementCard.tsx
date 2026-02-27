import type { Achievement } from '../types/achievements'

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div style={{
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-lg)',
      background: achievement.unlocked 
        ? 'linear-gradient(135deg, rgba(161, 0, 255, 0.1), rgba(123, 47, 190, 0.05))'
        : 'rgba(100, 109, 118, 0.1)',
      border: `2px solid ${achievement.unlocked 
        ? 'var(--accent-primary)' 
        : 'var(--border-subtle)'}`,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      opacity: achievement.unlocked ? 1 : 0.6,
      transform: achievement.unlocked ? 'scale(1.05)' : 'scale(1)',
      boxShadow: achievement.unlocked 
        ? '0 0 20px rgba(161, 0, 255, 0.3)' 
        : 'none'
    }}
    onMouseEnter={(e) => {
      if (achievement.unlocked) {
        const el = e.currentTarget
        el.style.transform = 'scale(1.1)'
        el.style.boxShadow = '0 0 30px rgba(161, 0, 255, 0.5)'
      }
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget
      el.style.transform = 'scale(1.05)'
      el.style.boxShadow = '0 0 20px rgba(161, 0, 255, 0.3)'
    }}>
      <div style={{ fontSize: '2.5em', marginBottom: 'var(--space-sm)' }}>
        {achievement.icon}
      </div>
      <h4 style={{ margin: '0 0 var(--space-xs) 0', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
        {achievement.name}
      </h4>
      <p style={{ 
        margin: 0, 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-secondary)',
        lineHeight: 1.4
      }}>
        {achievement.description}
      </p>
      {achievement.unlocked && achievement.unlockedDate && (
        <p style={{
          margin: 'var(--space-xs) 0 0 0',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--accent-primary)',
          fontWeight: 500
        }}>
          Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
