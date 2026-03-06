export type CompanyKit = {
  id: string
  company: string
  focusArea: string
  difficulty: string
  questionCount: number
  completionRate: number
  status: string
  lastUpdated: string
  tags: string[]
}

export type RoleProfile = {
  title: string
  salary: string
  requiredSubjects: string[]
  interviewQuestions: string[]
  sourceUrl?: string | null
}

export type CompanyProfile = {
  company: string
  lastSynced: string
  roles: RoleProfile[]
}

export type CompanyKitResponse = {
  username: string
  lastSynced: string
  recommendedCompanies: string[]
  kits: CompanyKit[]
}
