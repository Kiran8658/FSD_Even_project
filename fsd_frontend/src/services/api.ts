import type { User, DashboardStats, ActivityData, Skill, Insight } from '../types/dashboard'
import axiosClient from './axiosClient'

// Keep mock data as fallback during development
const ENABLE_MOCK_DATA = import.meta.env.MODE === 'development' && true // Set to true to test with mock data

const mockUser: User = {
  id: '1',
  username: 'devpulse_user',
  email: 'user@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devpulse',
  bio: 'Passionate developer & lifelong learner',
  joinDate: '2024-01-15',
  links: {
    linkedIn: 'https://www.linkedin.com/in/devpulse',
    github: 'https://github.com/devpulse',
    twitter: 'https://x.com/devpulse',
    website: 'https://devpulse.dev',
    resume: 'https://devpulse.dev/resume.pdf',
    telegram: 'https://t.me/devpulse',
    leetCode: 'https://leetcode.com/devpulse/'
  }
}

const mockStats: DashboardStats = {
  totalActivities: 156,
  currentStreak: 12,
  longestStreak: 34,
  consistencyRate: 87,
  skillsLearned: 8
}

const mockActivityData: ActivityData[] = [
  { date: '2024-01-10', count: 5 },
  { date: '2024-01-11', count: 8 },
  { date: '2024-01-12', count: 6 },
  { date: '2024-01-13', count: 9 },
  { date: '2024-01-14', count: 7 },
  { date: '2024-01-15', count: 4 },
  { date: '2024-01-16', count: 8 }
]

const mockSkills: Skill[] = [
  { name: 'React', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 85, category: 'Language' },
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'CSS', level: 88, category: 'Frontend' },
  { name: 'Database Design', level: 75, category: 'Backend' },
  { name: 'DevOps', level: 70, category: 'Tools' }
]

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Amazing Streak!',
    description: 'You\'ve maintained a 12-day learning streak. Keep it up!',
    type: 'achievement',
    icon: '🔥',
    timestamp: '2024-01-16'
  },
  {
    id: '2',
    title: 'Focus on Weak Areas',
    description: 'Consider spending more time on DevOps concepts this week.',
    type: 'tip',
    icon: '💡',
    timestamp: '2024-01-16'
  },
  {
    id: '3',
    title: 'Milestone Reached!',
    description: 'You\'ve completed 150+ learning activities. You\'re on fire! 🚀',
    type: 'milestone',
    icon: '🎯',
    timestamp: '2024-01-15'
  }
]

// Helper function for error handling
const handleError = (error: any, fallbackData?: any) => {
  if (ENABLE_MOCK_DATA && fallbackData) {
    console.warn('API Error, using mock data:', error.message)
    return fallbackData
  }
  throw error
}

export const api = {
  // ============ User Endpoints ============
  getUser: async (username: string): Promise<User> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: User }>(`/users/${username}`)
      return response.data.data
    } catch (error) {
      return handleError(error, mockUser)
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: User }>(`/users/id/${id}`)
      return response.data.data
    } catch (error) {
      return handleError(error, mockUser)
    }
  },

  // ============ Auth Endpoints ============
  signUp: async (email: string, password: string, username: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await axiosClient.post<{ success: boolean; data: { user: User; token: string } }>('/auth/signup', {
        name: username,
        username,
        email,
        password
      })
      return response.data.data
    } catch (error) {
      if (ENABLE_MOCK_DATA) {
        console.log('Mock signup:', email)
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: username,
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          bio: 'New learner!',
          joinDate: new Date().toISOString()
        }
        const mockToken = 'mock_jwt_' + Math.random().toString(36).substr(2, 20)
        return { user: newUser, token: mockToken }
      }
      throw error
    }
  },

  signIn: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await axiosClient.post<{ success: boolean; data: { user: User; token: string } }>('/auth/signin', {
        email,
        password
      })
      return response.data.data
    } catch (error) {
      if (ENABLE_MOCK_DATA) {
        console.log('Mock signin:', email)
        // Allow any login in mock mode
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          bio: 'Passionate learner',
          joinDate: new Date().toISOString()
        }
        const mockToken = 'mock_jwt_' + Math.random().toString(36).substr(2, 20)
        return { user: mockUser, token: mockToken }
      }
      throw error
    }
  },

  // ============ Dashboard Endpoints ============
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats')
      return response.data.data
    } catch (error) {
      return handleError(error, mockStats)
    }
  },

  getActivityData: async (days?: number): Promise<ActivityData[]> => {
    try {
      const params = days ? { days } : {}
      const response = await axiosClient.get<{ success: boolean; data: ActivityData[] }>('/dashboard/activities', { params })
      return response.data.data
    } catch (error) {
      return handleError(error, days ? mockActivityData.slice(-days) : mockActivityData)
    }
  },

  getSkills: async (): Promise<Skill[]> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: Skill[] }>('/dashboard/skills')
      return response.data.data
    } catch (error) {
      return handleError(error, mockSkills)
    }
  },

  getInsights: async (): Promise<Insight[]> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: Insight[] }>('/dashboard/insights')
      return response.data.data
    } catch (error) {
      return handleError(error, mockInsights)
    }
  },

  // ============ Activity Endpoints ============
  logActivity: async (activity: any): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await axiosClient.post('/dashboard/activities/log', activity)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ============ Skill Endpoints ============
  updateSkillLevel: async (skillId: string, level: number): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.put(`/dashboard/skills/${skillId}`, { level })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default api
