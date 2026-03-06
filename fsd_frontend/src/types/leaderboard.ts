import type { PlatformStat } from './dashboard'

export type PlatformLeaderboardMetric =
  | 'cscore'
  | 'totalSolved'
  | 'leetcode'
  | 'codeforces'
  | 'codechef'

export type PlatformLeaderboardEntry = {
  rank: number
  userId?: string | null
  username: string
  name?: string | null
  avatar?: string | null
  value: number

  // Present for platform metrics (leetcode/codeforces/codechef)
  platform?: PlatformStat | null
}
