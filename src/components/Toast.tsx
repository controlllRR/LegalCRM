interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm text-white shadow-lg ring-1 ring-white/10">
        <svg
          className="h-4 w-4 shrink-0 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  )
}
