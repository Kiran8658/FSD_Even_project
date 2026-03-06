export interface User {
  id: string
  username: string
  email: string
  name?: string
  avatar?: string
  bio?: string
  college?: string
  joinDate: string
  links?: {
    linkedIn?: string
    github?: string
    twitter?: string
    website?: string
    resume?: string
    telegram?: string
    leetCode?: string
    codeChef?: string
    codeForces?: string
    hackerRank?: string
    atCoder?: string
  }
}

export type PlatformStat = {
  handle?: string | null
  profileUrl?: string | null
  solved?: number | null
  globalRank?: number | null
  contests?: number | null
  rating?: number | null
  rankText?: string | null
  easy?: number | null
  medium?: number | null
  hard?: number | null
  error?: string | null
}

export type PlatformStatsSummary = {
  totalSolved: number
  platforms: Record<string, PlatformStat>
}

export interface ActivityData {
  date: string
  count: number
}

export interface Skill {
  name: string
  level: number // 0-100
  category: string
}

export interface Insight {
  id: string
  title: string
  description: string
  type: 'tip' | 'achievement' | 'milestone'
  icon: string
  timestamp: string
}

export interface DashboardStats {
  totalActivities: number
  currentStreak: number
  longestStreak: number
  consistencyRate: number
  skillsLearned: number
}

export interface ConsistencyMetrics {
  week: number[]
  month: number[]
  year: number
}
