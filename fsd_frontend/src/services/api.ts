import type { User, DashboardStats, ActivityData, Skill, Insight } from '../types/dashboard'
import type { CompanyKitResponse } from '../types/quiz'
import axiosClient from './axiosClient'

// Keep mock data as fallback during development
const ENABLE_MOCK_DATA = false // Set to true to test with mock data, false to use real backend

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

const mockCompanyKits: CompanyKitResponse = {
  username: 'devpulse_user',
  lastSynced: '2024-01-16T09:00:00Z',
  recommendedCompanies: ['Amazon', 'Microsoft', 'Uber'],
  kits: [
    {
      id: 'amazon-sde',
      company: 'Amazon',
      focusArea: 'Data Structures & LP',
      difficulty: 'Medium',
      questionCount: 45,
      completionRate: 72,
      status: 'Ready',
      lastUpdated: 'Jan 15',
      tags: ['Arrays', 'Graphs', 'Leadership']
    },
    {
      id: 'microsoft-swe',
      company: 'Microsoft',
      focusArea: 'System Design Warmups',
      difficulty: 'Medium',
      questionCount: 30,
      completionRate: 64,
      status: 'Ready',
      lastUpdated: 'Jan 14',
      tags: ['Design', 'APIs', 'Scalability']
    },
    {
      id: 'google-advanced',
      company: 'Google',
      focusArea: 'Algorithmic Patterns',
      difficulty: 'Hard',
      questionCount: 50,
      completionRate: 51,
      status: 'In Progress',
      lastUpdated: 'Jan 13',
      tags: ['DP', 'Greedy', 'Graphs']
    },
    {
      id: 'meta-ml',
      company: 'Meta',
      focusArea: 'ML Fundamentals',
      difficulty: 'Medium',
      questionCount: 28,
      completionRate: 57,
      status: 'Ready',
      lastUpdated: 'Jan 12',
      tags: ['ML', 'Product', 'Math']
    },
    {
      id: 'uber-analytics',
      company: 'Uber',
      focusArea: 'SQL & Experimentation',
      difficulty: 'Easy',
      questionCount: 24,
      completionRate: 83,
      status: 'Ready',
      lastUpdated: 'Jan 12',
      tags: ['SQL', 'Case Study', 'Metrics']
    }
  ]
}

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
  signUp: async (name: string, username: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await axiosClient.post<{ success: boolean; data: { user: User; token: string } }>('/auth/signup', {
        name,
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
          name,
          bio: 'New learner!',
          joinDate: new Date().toISOString()
        }
        const mockToken = 'mock_jwt_' + Math.random().toString(36).substr(2, 20)
        return { user: newUser, token: mockToken }
      }
      throw error
    }
  },

  signIn: async (identifier: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      console.log('[API] Sending signin request for:', identifier)
      const response = await axiosClient.post<{ success: boolean; data: { user: User; token: string } }>('/auth/signin', {
        identifier,
        password
      })
      console.log('[API] Signin response received:', {
        success: response.data.success,
        hasToken: !!response.data.data?.token,
        hasUser: !!response.data.data?.user
      })
      return response.data.data
    } catch (error: any) {
      console.error('[API] Signin error:', error.response?.data || error.message)
      if (ENABLE_MOCK_DATA) {
        console.log('Mock signin:', identifier)
        // Allow any login in mock mode
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
          email: identifier.includes('@') ? identifier : `${identifier}@ghostwrite.dev`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${identifier}`,
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

  // ============ Quiz Endpoints ============
  getCompanyKits: async (): Promise<CompanyKitResponse> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: CompanyKitResponse }>('/quiz/kits')
      return response.data.data
    } catch (error) {
      return handleError(error, mockCompanyKits)
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
  },

  // ============ User Profile Endpoints ============
  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await axiosClient.put<{ success: boolean; data: User }>('/users/me', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosClient.put('/users/me/password', { currentPassword, newPassword })
  },

  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete('/users/me')
  }
}

export default api
