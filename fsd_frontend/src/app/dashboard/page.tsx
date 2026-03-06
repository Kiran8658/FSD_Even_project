import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { ActivityChart } from '../../components/ActivityChart'
import { ConsistencyCard } from '../../components/ConsistencyCard'
import { SkillChart } from '../../components/SkillChart'
import { InsightCard } from '../../components/InsightCard'
import { AchievementCard } from '../../components/AchievementCard'
import { SkeletonLoader, SkeletonCard } from '../../components/LoadingSkeleton'
import api from '../../services/api'
import type { DashboardStats, ActivityData, Skill, Insight } from '../../types/dashboard'
import type { Achievement } from '../../types/achievements'
import { ACHIEVEMENTS } from '../../types/achievements'
import { useWebSocket } from '../../context/WebSocketContext'

export default function DashboardPage() {
  const { dashboardStats } = useWebSocket()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const computeAchievements = (nextStats: DashboardStats) => {
    return ACHIEVEMENTS.map((ach) => {
      let unlocked = false
      if (ach.id === 'first_step' && nextStats.totalActivities >= 1) unlocked = true
      if (ach.id === 'on_fire' && nextStats.currentStreak >= 7) unlocked = true
      if (ach.id === 'consistent' && nextStats.consistencyRate >= 80) unlocked = true
      if (ach.id === 'skill_master' && nextStats.skillsLearned >= 5) unlocked = true
      if (ach.id === 'unstoppable' && nextStats.currentStreak >= 30) unlocked = true
      if (ach.id === 'legend' && nextStats.totalActivities >= 100) unlocked = true
      if (ach.id === 'perfectionist' && nextStats.consistencyRate >= 95) unlocked = true
      if (ach.id === 'renaissance' && nextStats.skillsLearned >= 10) unlocked = true

      return {
        ...ach,
        unlocked,
        unlockedDate: unlocked ? new Date().toISOString() : undefined
      }
    })
  }

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)
      
      // Debug: Check if token exists
      const token = localStorage.getItem('ghostwrite_token')
      const user = localStorage.getItem('ghostwrite_user')
      console.log('Dashboard loading - Token exists:', !!token, 'User exists:', !!user)
      
      if (!token || !user) {
        console.error('No token or user found in localStorage')
        setError('Not authenticated. Please sign in again.')
        setLoading(false)
        // Will be redirected by axios interceptor
        return
      }
      
      try {
        console.log('Fetching dashboard data...')
        const [statsData, activityData, skillsData, insightsData] = await Promise.all([
          api.getDashboardStats(),
          api.getActivityData(7),
          api.getSkills(),
          api.getInsights()
        ])
        
        console.log('Dashboard data loaded:', { statsData, activityData, skillsData, insightsData })
        
        setStats(statsData)
        setActivities(activityData)
        setSkills(skillsData)
        setInsights(insightsData)

        // Check unlocked achievements
        setAchievements(computeAchievements(statsData))
      } catch (error: any) {
        console.error('Failed to load dashboard:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard data'
        setError(errorMsg)
      }
      setLoading(false)
    }

    loadDashboard()
  }, [])

  useEffect(() => {
    if (!dashboardStats) return
    setStats(dashboardStats)
    setAchievements(computeAchievements(dashboardStats))
  }, [dashboardStats])

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1>Welcome back! 👋</h1>
            <p className="text-muted">Track your learning progress and achievements</p>
          </div>
          {/* Error Message */}
          {error && (
            <div style={{
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-xl)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              color: '#ef4444'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Stats Cards with Loading Skeleton */}
          {loading ? (
            <SkeletonLoader />
          ) : stats ? (
            <div className="grid cols-4" style={{ marginBottom: 'var(--space-2xl)' }}>
              <div className="card">
                <p className="text-muted" style={{ margin: '0 0 var(--space-md) 0' }}>Total Activities</p>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                  {stats.totalActivities}
                </div>
              </div>
              <div className="card">
                <p className="text-muted" style={{ margin: '0 0 var(--space-md) 0' }}>Current Streak</p>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  {stats.currentStreak} 🔥
                </div>
              </div>
              <div className="card">
                <p className="text-muted" style={{ margin: '0 0 var(--space-md) 0' }}>Skills Learned</p>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                  {stats.skillsLearned}
                </div>
              </div>
              <div className="card">
                <p className="text-muted" style={{ margin: '0 0 var(--space-md) 0' }}>Consistency</p>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                  {stats.consistencyRate}%
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            {/* Left Column */}
            <div>
              {loading ? <SkeletonCard /> : <ActivityChart data={activities} />}
            </div>

            {/* Right Column */}
            <div>
              {loading ? (
                <SkeletonCard />
              ) : stats ? (
                <ConsistencyCard
                  currentStreak={stats.currentStreak}
                  longestStreak={stats.longestStreak}
                  consistencyRate={stats.consistencyRate}
                />
              ) : null}
            </div>
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            {loading ? <SkeletonCard /> : <SkillChart skills={skills} />}
          </div>

          {/* Insights Section */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            {loading ? <SkeletonCard /> : <InsightCard insights={insights} />}
          </div>

          {/* Achievements Section */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>🏆 Achievements</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-md)'
            }}>
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          main > div > div {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .grid.cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          main > div > div:nth-child(6) > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}
