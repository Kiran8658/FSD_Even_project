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

export type CompanyKitResponse = {
  username: string
  lastSynced: string
  recommendedCompanies: string[]
  kits: CompanyKit[]
}
