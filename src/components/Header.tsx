export function Header() {
  return (
    <header className="border-b border-white/10 bg-navy-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400/20 ring-1 ring-gold-400/40">
            <svg
              className="h-5 w-5 text-gold-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              LegalCRM
            </h1>
            <p className="text-xs text-slate-400 sm:text-sm">
              Управление клиентами юридической практики
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Юрист: А. Петров
        </div>
      </div>
    </header>
  )
}
