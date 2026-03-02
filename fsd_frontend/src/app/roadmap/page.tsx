import { useState, useEffect } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import api from '../../services/api'
import type { Skill } from '../../types/dashboard'

interface Sheet {
  id: string
  title: string
  description: string
  skills: string[]
  progress: number
  total: number
}

const defaultSheets: Sheet[] = [
  { id: '1', title: 'DSA Fundamentals', description: 'Arrays, Strings, Linked Lists, Stacks & Queues', skills: ['Arrays', 'Strings', 'LinkedList'], progress: 0, total: 40 },
  { id: '2', title: 'Dynamic Programming', description: '1D DP, 2D DP, Knapsack, LCS, MCM patterns', skills: ['DP', 'Memoization'], progress: 0, total: 50 },
  { id: '3', title: 'Graph Algorithms', description: 'BFS, DFS, Dijkstra, Topological Sort, MST', skills: ['Graphs', 'Trees'], progress: 0, total: 35 },
  { id: '4', title: 'System Design Basics', description: 'Load Balancing, Caching, DB Sharding, CAP Theorem', skills: ['System Design'], progress: 0, total: 20 },
]

export default function RoadmapPage() {
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    try {
      const saved = localStorage.getItem('fedf_my_sheets')
      return saved ? JSON.parse(saved) : defaultSheets
    } catch { return defaultSheets }
  })
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    api.getSkills().then(setSkills).catch(() => {})
  }, [])

  const toggleProgress = (id: string, delta: number) => {
    setSheets(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, progress: Math.max(0, Math.min(s.total, s.progress + delta)) } : s)
      localStorage.setItem('fedf_my_sheets', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ margin: '0 0 4px' }}>My Sheets</h1>
            <p className="text-muted">Track your progress across different problem sheets.</p>
          </div>

          {/* Skill summary bar */}
          {skills.length > 0 && (
            <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Your Skills:</span>
              {skills.slice(0, 6).map(s => (
                <span key={s.name} style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(14,165,233,0.12)', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 500 }}>
                  {s.name} — {s.level}%
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {sheets.map(sheet => {
              const pct = sheet.total > 0 ? Math.round((sheet.progress / sheet.total) * 100) : 0
              return (
                <div key={sheet.id} className="card" style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700 }}>{sheet.title}</h3>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{sheet.description}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {sheet.skills.map(sk => (
                      <span key={sk} style={{ padding: '2px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', fontSize: '11px', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{sk}</span>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: '6px', height: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#2EC866' : 'var(--accent-primary)', borderRadius: '6px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{sheet.progress} / {sheet.total} solved ({pct}%)</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => toggleProgress(sheet.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>−</button>
                      <button onClick={() => toggleProgress(sheet.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>+</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
