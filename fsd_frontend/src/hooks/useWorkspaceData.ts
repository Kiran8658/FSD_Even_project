import { useEffect, useState } from 'react'
import api from '../services/api'
import type { DashboardStats, ActivityData, Skill, Insight } from '../types/dashboard'

type WorkspaceOptions = {
  activityDays?: number
  refreshInterval?: number
}

type WorkspaceState = {
  stats: DashboardStats | null
  activities: ActivityData[]
  skills: Skill[]
  insights: Insight[]
  loading: boolean
  error: string | null
}

export function useWorkspaceData(options: WorkspaceOptions = {}): WorkspaceState {
  const { activityDays = 14, refreshInterval = 60000 } = options
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let intervalId: ReturnType<typeof setInterval> | null = null

    const loadWorkspace = async () => {
      try {
        if (!isMounted) return
        setLoading(true)
        const [statsData, activityData, skillsData, insightsData] = await Promise.all([
          api.getDashboardStats(),
          api.getActivityData(activityDays),
          api.getSkills(),
          api.getInsights()
        ])

        if (!isMounted) return
        setStats(statsData)
        setActivities(activityData)
        setSkills(skillsData)
        setInsights(insightsData)
        setError(null)
      } catch (err: any) {
        if (!isMounted) return
        const message = err?.response?.data?.message || err?.message || 'Unable to load workspace data'
        setError(message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWorkspace()
    if (refreshInterval > 0) {
      intervalId = setInterval(loadWorkspace, refreshInterval)
    }

    return () => {
      isMounted = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [activityDays, refreshInterval])

  return { stats, activities, skills, insights, loading, error }
}
