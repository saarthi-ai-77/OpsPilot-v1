export interface DailyUpdate {
  id: string;
  email: string;
  workDone: string;
  blockers: string;
  confidence: 'low' | 'medium' | 'high';
  submittedAt: string;
}

const UPDATES_STORAGE_KEY = 'opspilot_updates';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getUpdates(): DailyUpdate[] {
  const stored = localStorage.getItem(UPDATES_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUpdate(update: Omit<DailyUpdate, 'id' | 'submittedAt'>): DailyUpdate {
  const updates = getUpdates();
  const newUpdate: DailyUpdate = {
    ...update,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  updates.push(newUpdate);
  localStorage.setItem(UPDATES_STORAGE_KEY, JSON.stringify(updates));
  return newUpdate;
}

export function hasSubmittedToday(email: string): boolean {
  const updates = getUpdates();
  const today = getToday();
  return updates.some(
    (u) => u.email === email && u.submittedAt.startsWith(today)
  );
}

export function getTodaysUpdates(): DailyUpdate[] {
  const updates = getUpdates();
  const today = getToday();
  return updates.filter((u) => u.submittedAt.startsWith(today));
}

export function getUpdatesByDate(date: string): DailyUpdate[] {
  const updates = getUpdates();
  return updates.filter((u) => u.submittedAt.startsWith(date));
}
