import { useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'

interface Note {
  id: string
  title: string
  content: string
  color: string
  createdAt: string
}

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

export default function IdeasPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('fedf_notes')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [draft, setDraft] = useState({ title: '', content: '' })
  const [editId, setEditId] = useState<string | null>(null)

  const persist = (updated: Note[]) => {
    setNotes(updated)
    localStorage.setItem('fedf_notes', JSON.stringify(updated))
  }

  const handleSave = () => {
    if (!draft.title.trim()) return
    if (editId) {
      persist(notes.map(n => n.id === editId ? { ...n, title: draft.title, content: draft.content } : n))
      setEditId(null)
    } else {
      const note: Note = {
        id: Date.now().toString(),
        title: draft.title,
        content: draft.content,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        createdAt: new Date().toLocaleDateString()
      }
      persist([note, ...notes])
    }
    setDraft({ title: '', content: '' })
  }

  const handleDelete = (id: string) => persist(notes.filter(n => n.id !== id))

  const handleEdit = (note: Note) => {
    setDraft({ title: note.title, content: note.content })
    setEditId(note.id)
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ margin: '0 0 4px' }}>Notes</h1>
            <p className="text-muted">Jot down quick notes, ideas, and reminders.</p>
          </div>

          {/* New note form */}
          <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
            <input
              value={draft.title}
              onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
              placeholder="Note title..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: '10px', outline: 'none', boxSizing: 'border-box' }}
            />
            <textarea
              value={draft.content}
              onChange={e => setDraft(p => ({ ...p, content: e.target.value }))}
              placeholder="Write your note here..."
              rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button onClick={handleSave} style={{ padding: '9px 22px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                {editId ? 'Update Note' : 'Add Note'}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setDraft({ title: '', content: '' }) }} style={{ padding: '9px 22px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>Cancel</button>
              )}
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <p style={{ fontSize: '3em', marginBottom: 'var(--space-md)' }}>📝</p>
              <p className="text-muted">No notes yet. Add your first note above!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {notes.map(note => (
                <div key={note.id} className="card" style={{ padding: '20px', borderTop: `3px solid ${note.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{note.title}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => handleEdit(note)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px' }}>✏️</button>
                      <button onClick={() => handleDelete(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px' }}>🗑️</button>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{note.content}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{note.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
