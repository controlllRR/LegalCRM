import type { Activity, ActivityType } from '../types/activity'

const STORAGE_KEY = 'legalcrm-activity'

function load(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Activity[]
  } catch {
    /* ignore */
  }
  return []
}

function save(activities: Activity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, 100)))
}

export function logActivity(
  clientId: string,
  clientName: string,
  type: ActivityType,
  message: string
) {
  const entry: Activity = {
    id: crypto.randomUUID(),
    clientId,
    clientName,
    type,
    message,
    timestamp: new Date().toISOString(),
  }
  save([entry, ...load()])
}

export function getActivities(): Activity[] {
  return load()
}

export function getClientActivities(clientId: string): Activity[] {
  return load().filter((a) => a.clientId === clientId)
}
