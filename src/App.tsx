import { useState } from 'react'
import type { Client, ViewMode } from './types/client'
import { Header } from './components/Header'
import { StatusCounters } from './components/StatusCounters'
import { ClientTable } from './components/ClientTable'
import { KanbanBoard } from './components/KanbanBoard'
import { AddClientForm } from './components/AddClientForm'
import { ClientDetailPanel } from './components/ClientDetailPanel'
import { DaySummary } from './components/DaySummary'
import { ActivityFeed } from './components/ActivityFeed'
import { ViewToggle } from './components/ViewToggle'
import { Toast } from './components/Toast'
import { useClients } from './hooks/useClients'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<ViewMode>('kanban')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const {
    clients,
    counts,
    activities,
    notification,
    addClient,
    updateStatus,
    updateClient,
    deleteClient,
    getTimeline,
  } = useClients()

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Дашборд</h2>
              <p className="mt-1 text-sm text-slate-500">
                Управление делами · дедлайны · автоматизация
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-gold-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добавить клиента
            </button>
          </div>

          <StatusCounters counts={counts} />
        </section>

        <DaySummary clients={clients} />

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy-900">Дела</h3>
              <ViewToggle view={view} onChange={setView} />
            </div>

            {view === 'table' ? (
              <ClientTable
                clients={clients}
                onStatusChange={updateStatus}
                onDelete={deleteClient}
                onOpenClient={setSelectedClient}
              />
            ) : (
              <KanbanBoard
                clients={clients}
                onStatusChange={updateStatus}
                onOpenClient={setSelectedClient}
              />
            )}
          </div>

          <ActivityFeed activities={activities} />
        </div>
      </main>

      {showForm && (
        <AddClientForm onSubmit={addClient} onClose={() => setShowForm(false)} />
      )}

      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          timeline={getTimeline(selectedClient.id)}
          onClose={() => setSelectedClient(null)}
          onUpdate={(patch) => {
            updateClient(selectedClient.id, patch)
            setSelectedClient((prev: Client | null) =>
              prev ? { ...prev, ...patch } : null
            )
          }}
        />
      )}

      <Toast message={notification} />
    </div>
  )
}

export default App
