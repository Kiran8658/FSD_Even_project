import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/Sidebar'

export default function DeliveryPage() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="page-shell" style={{ marginLeft: '250px', padding: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1>Delivery</h1>
            <p className="text-muted">Track your learning delivery and progress</p>
          </div>

          <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontSize: '3em', marginBottom: 'var(--space-lg)' }}>🚀</p>
            <h2>Delivery</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
              Coming soon - monitor and track your learning delivery progress.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
