import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'
import { api, type NoteRecord } from '../../services/api'

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

type Note = {
  id: number
  title: string
  content: string
  color: string
  createdAt: string
}

const toUiNote = (n: NoteRecord): Note => ({
  id: n.id,
  title: n.title,
  content: n.content || '',
  color: n.color || COLORS[0],
  createdAt: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
})

export default function IdeasPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [draft, setDraft] = useState({ title: '', content: '' })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    api.getNotes()
      .then((data) => {
        if (!mounted) return
        setNotes(data.map(toUiNote))
      })
      .catch(() => {
        // If unauthenticated, axiosClient will redirect to /signin.
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleSave = () => {
    if (!draft.title.trim()) return
    if (editId) {
      const id = Number(editId)
      api.updateNote(id, { title: draft.title, content: draft.content, color: notes.find(n => n.id === id)?.color })
        .then((updated) => {
          setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, title: updated.title, content: updated.content || n.content } : n))
          )
          setEditId(null)
        })
        .catch(() => {})
    } else {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      api.createNote({ title: draft.title, content: draft.content, color })
        .then((created) => {
          setNotes((prev) => [toUiNote(created), ...prev])
        })
        .catch(() => {})
    }
    setDraft({ title: '', content: '' })
  }

  const handleDelete = (id: number) => {
    api.deleteNote(id)
      .then(() => setNotes((prev) => prev.filter((n) => n.id !== id)))
      .catch(() => {})
  }

  const handleEdit = (note: Note) => {
    setDraft({ title: note.title, content: note.content })
    setEditId(String(note.id))
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
