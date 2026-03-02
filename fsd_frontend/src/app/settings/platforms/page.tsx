import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Navbar } from '../../../components/Navbar'
import { Sidebar } from '../../../components/Sidebar'
import { SettingsSidebar } from '../../../components/SettingsSidebar'
import api from '../../../services/api'

const devPlatforms = [
  { key: 'github', label: 'Github', icon: 'https://cdn.simpleicons.org/github/181717', prefix: 'https://github.com/' },
]

const problemPlatforms = [
  { key: 'leetcode', label: 'LeetCode', icon: 'https://cdn.simpleicons.org/leetcode/FFA116', prefix: 'https://leetcode.com/u/' },
  { key: 'codestudio', label: 'CodeStudio', icon: 'https://cdn.simpleicons.org/codingninjas/E05D0E', prefix: 'https://www.naukri.com/code360/profile/' },
  { key: 'geeksforgeeks', label: 'GeeksForGeeks', icon: 'https://cdn.simpleicons.org/geeksforgeeks/2F8D46', prefix: 'https://www.geeksforgeeks.org/user/' },
  { key: 'interviewbit', label: 'InterviewBit', icon: 'https://cdn.simpleicons.org/interviewbit/4B92DB', prefix: 'https://www.interviewbit.com/profile/' },
  { key: 'codechef', label: 'CodeChef', icon: 'https://cdn.simpleicons.org/codechef/5B4638', prefix: 'https://www.codechef.com/users/' },
  { key: 'codeforces', label: 'CodeForces', icon: 'https://cdn.simpleicons.org/codeforces/1F8ACB', prefix: 'https://codeforces.com/profile/' },
  { key: 'hackerrank', label: 'HackerRank', icon: 'https://cdn.simpleicons.org/hackerrank/2EC866', prefix: 'https://www.hackerrank.com/profile/' },
  { key: 'atcoder', label: 'AtCoder', icon: 'https://cdn.simpleicons.org/atcoder/222222', prefix: 'https://atcoder.jp/users/' },
]

export default function PlatformsSettingsPage() {
  const { user, updateUser } = useAuth()

  const [usernames, setUsernames] = useState<Record<string, string>>({
    github: '', leetcode: '', codestudio: '', geeksforgeeks: '',
    interviewbit: '', codechef: '', codeforces: '', hackerrank: '', atcoder: ''
  })
  const [verified, setVerified] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  // Seed from user profile links on mount
  useEffect(() => {
    if (user?.links) {
      const extractUsername = (url?: string, prefix?: string) => {
        if (!url || !prefix) return ''
        return url.startsWith(prefix) ? url.slice(prefix.length).replace(/\/$/, '') : url
      }
      const gh = extractUsername(user.links.github, 'https://github.com/')
      const lc = extractUsername(user.links.leetCode, 'https://leetcode.com/u/')
      const init: Record<string, string> = { ...usernames }
      if (gh) { init.github = gh }
      if (lc) { init.leetcode = lc }
      setUsernames(init)
      const v = new Set<string>()
      if (gh) v.add('github')
      if (lc) v.add('leetcode')
      setVerified(v)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSubmit = async (key: string, label: string) => {
    if (!usernames[key]) return
    // Persist github & leetcode to backend
    if (key === 'github' || key === 'leetcode') {
      const prefix = key === 'github' ? 'https://github.com/' : 'https://leetcode.com/u/'
      const linkField = key === 'github' ? 'github' : 'leetCode'
      try {
        const updated = await api.updateProfile({
          links: { ...user?.links, [linkField]: `${prefix}${usernames[key]}` }
        })
        updateUser(updated)
      } catch {
        showToast(`Failed to save ${label}.`)
        return
      }
    }
    setVerified(prev => new Set([...prev, key]))
    showToast(`${label} saved!`)
  }

  const handleClear = (key: string) => {
    setUsernames(prev => ({ ...prev, [key]: '' }))
    setVerified(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  const renderRow = (p: { key: string; label: string; icon: string; prefix: string }, borderBottom: boolean) => (
    <div key={p.key} style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      paddingBottom: '20px', marginBottom: borderBottom ? '20px' : '0',
      borderBottom: borderBottom ? '1px solid var(--border-subtle)' : 'none'
    }}>
      <img src={p.icon} alt={p.label} width="32" height="32" style={{ flexShrink: 0 }} />
      <span style={{ width: '140px', fontWeight: 500, fontSize: 'var(--font-size-sm)', flexShrink: 0 }}>{p.label} ›</span>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        border: '1px solid var(--border-subtle)', borderRadius: '8px',
        overflow: 'hidden', background: 'var(--bg-secondary)'
      }}>
        <span style={{
          padding: '10px 12px', fontSize: '12px', color: 'var(--text-tertiary)',
          borderRight: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
          background: 'var(--bg-primary)', lineHeight: 1.4
        }}>{p.prefix}</span>
        <input
          placeholder="johndoe"
          value={usernames[p.key] || ''}
          onChange={(e) => setUsernames(prev => ({ ...prev, [p.key]: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(p.key, p.label) }}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '10px 14px', fontSize: 'var(--font-size-sm)',
            color: 'var(--text-primary)', outline: 'none'
          }}
        />
      </div>
      {verified.has(p.key) ? (
        <>
          <button
            onClick={() => { if (usernames[p.key]) window.open(`${p.prefix}${usernames[p.key]}`, '_blank') }}
            style={{
              padding: '8px 18px', background: 'none', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer',
              fontSize: 'var(--font-size-sm)', fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >Verify</button>
          <span style={{
            width: '30px', height: '30px', borderRadius: '50%', background: '#2EC866',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '15px', color: '#fff', fontWeight: 700
          }}>✓</span>
        </>
      ) : (
        <button
          onClick={() => handleSubmit(p.key, p.label)}
          style={{
            padding: '8px 18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
            borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer',
            fontSize: 'var(--font-size-sm)', fontWeight: 600, whiteSpace: 'nowrap'
          }}
        >Submit</button>
      )}
      <button
        onClick={() => handleClear(p.key)}
        title="Clear"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-tertiary)', fontSize: '18px', padding: '4px', flexShrink: 0, lineHeight: 1
        }}
      >🗑</button>
    </div>
  )

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '0', minHeight: 'calc(100vh - 70px)' }}>

          <SettingsSidebar />

          {/* Main Content */}
          <div style={{ flex: 1, paddingLeft: '48px', paddingTop: '8px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>Platforms</h2>
            <p style={{ margin: '0 0 32px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              You can update and verify your platform details here.
            </p>

            {/* Development */}
            <h4 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Development</h4>
            <div style={{ marginBottom: '32px' }}>
              {devPlatforms.map((p, i) => renderRow(p, i < devPlatforms.length - 1))}
            </div>

            {/* Problem Solving */}
            <h4 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Problem Solving</h4>
            <div style={{ marginBottom: '24px' }}>
              {problemPlatforms.map((p, i) => renderRow(p, i < problemPlatforms.length - 1))}
            </div>

            <div style={{
              padding: '12px 16px', background: 'rgba(255,165,0,0.08)',
              border: '1px solid rgba(255,165,0,0.3)', borderRadius: '8px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              fontSize: '13px', color: 'var(--text-secondary)'
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
              <span>
                If you are getting this warning, please check the{' '}
                <a href="https://faq.example.com" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent-primary)' }}>FAQ</a>{' '}
                to know why this happens and how to fix it.
              </span>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
            background: '#1e1e2e', color: '#fff', padding: '12px 24px',
            borderRadius: '10px', fontSize: 'var(--font-size-sm)', fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999
          }}>{toast}</div>
        )}
      </main>
    </>
  )
}
