export type ClientStatus = 'new' | 'in_progress' | 'closed'

export interface Client {
  id: string
  name: string
  phone: string
  status: ClientStatus
  createdAt: string
  deadline?: string
  notes?: string
}

export interface StatusCounts {
  new: number
  in_progress: number
  closed: number
  total: number
}

export type ViewMode = 'table' | 'kanban'
