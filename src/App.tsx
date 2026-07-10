import { useState } from 'react'
import { Header } from './components/Header'
import { StatusCounters } from './components/StatusCounters'
import { ClientTable } from './components/ClientTable'
import { AddClientForm } from './components/AddClientForm'
import { Toast } from './components/Toast'
import { useClients } from './hooks/useClients'

function App() {
  const [showForm, setShowForm] = useState(false)
  const { clients, counts, notification, addClient, updateStatus, deleteClient } =
    useClients()

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Дашборд</h2>
              <p className="mt-1 text-sm text-slate-500">
                Обзор клиентской базы и статусов дел
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-gold-500"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добавить клиента
            </button>
          </div>

          <StatusCounters counts={counts} />
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-navy-900">
            Список клиентов
          </h3>
          <ClientTable
            clients={clients}
            onStatusChange={(id, status) => updateStatus(id, status)}
            onDelete={deleteClient}
          />
        </section>
      </main>

      {showForm && (
        <AddClientForm
          onSubmit={addClient}
          onClose={() => setShowForm(false)}
        />
      )}

      <Toast message={notification} />
    </div>
  )
}

export default App
