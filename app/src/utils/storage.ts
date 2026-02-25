/**
 * LocalStorage keys and helpers for persisting flashcard progress.
 * Session state is saved so that refreshing the page preserves progress.
 */

const SESSION_KEY = 'flashcards-session'

export type AnswerStatus = 'correct' | 'incorrect'

/**
 * Minimal snapshot of a study session stored in LocalStorage.
 * cardOrder keeps the randomized order of cards for a deck so refreshes
 * preserve which card comes next.
 */
export type PersistedSession = {
  deckId: string
  currentIndex: number
  answers: Record<string, AnswerStatus>
  cardOrder?: number[]
}

export function getPersistedSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!data || typeof data !== 'object') return null

    const candidate = data as Partial<PersistedSession>
    if (typeof candidate.deckId !== 'string') return null
    if (typeof candidate.currentIndex !== 'number') return null
    if (!candidate.answers || typeof candidate.answers !== 'object') return null
    if (candidate.cardOrder && !Array.isArray(candidate.cardOrder)) return null

    return candidate as PersistedSession
  } catch {
    // ignore invalid or missing data
  }
  return null
}

export function setPersistedSession(session: PersistedSession | null): void {
  try {
    if (session === null) {
      localStorage.removeItem(SESSION_KEY)
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  } catch {
    // ignore quota or other errors
  }
}
