export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'note_updated'
  | 'deadline_set'

export interface Activity {
  id: string
  clientId: string
  clientName: string
  type: ActivityType
  message: string
  timestamp: string
}
