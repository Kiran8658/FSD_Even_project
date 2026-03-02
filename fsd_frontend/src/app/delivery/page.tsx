import { useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'

interface Contest {
  id: string
  name: string
  platform: string
  date: string
  time: string
  duration: string
  link: string
  icon: string
}

const upcomingContests: Contest[] = [
  { id: '1', name: 'Weekly Contest 432', platform: 'LeetCode', date: 'Every Sunday', time: '08:00 AM IST', duration: '1h 30m', link: 'https://leetcode.com/contest/', icon: '🟡' },
  { id: '2', name: 'Biweekly Contest 148', platform: 'LeetCode', date: 'Alternate Saturdays', time: '08:00 PM IST', duration: '1h 30m', link: 'https://leetcode.com/contest/', icon: '🟡' },
  { id: '3', name: 'Codeforces Round', platform: 'Codeforces', date: 'Tue / Thu / Sat', time: 'Varies', duration: '2h', link: 'https://codeforces.com/contests', icon: '🔵' },
  { id: '4', name: 'Starters', platform: 'CodeChef', date: 'Every Wednesday', time: '08:00 PM IST', duration: '2h', link: 'https://www.codechef.com/contests', icon: '🟤' },
  { id: '5', name: 'Kick Start / Hacker Cup', platform: 'Meta / Google', date: 'Seasonal', time: 'Varies', duration: '3h', link: 'https://www.facebook.com/codingcompetitions/hacker-cup', icon: '🔴' },
]

export default function DeliveryPage() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('fedf_contest_bookmarks')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem('fedf_contest_bookmarks', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ margin: '0 0 4px' }}>Contests</h1>
            <p className="text-muted">Stay updated with upcoming coding contests across platforms.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingContests.map(contest => (
              <div key={contest.id} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{contest.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{contest.name}</h3>
                    <span style={{ padding: '2px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', fontSize: '11px', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{contest.platform}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>📅 {contest.date}</span>
                    <span>🕐 {contest.time}</span>
                    <span>⏱️ {contest.duration}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleBookmark(contest.id)}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: bookmarks.has(contest.id) ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >{bookmarks.has(contest.id) ? '⭐' : '☆'}</button>
                  <a
                    href={contest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '8px 18px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                  >Visit ↗</a>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '24px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Bookmark contests you want to participate in. Visit the platform link to register before the contest starts.
            </span>
          </div>
        </div>
      </main>
    </>
  )
}
