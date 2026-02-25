import { useEffect, useMemo, useState } from 'react'
import type { Card, Deck } from '../types/flashcards'
import { getPersistedSession, setPersistedSession } from '../utils/storage'

/** User's self-reported result for a card (correct or needs review). */
export type AnswerStatus = 'correct' | 'incorrect'

/** In-memory state for an active or completed study session (normal or redo). */
export type SessionState = {
  deck: Deck
  currentIndex: number
  isFlipped: boolean
  answers: Record<string, AnswerStatus>
  isRedoSession?: boolean
  originalAnswers?: Record<string, AnswerStatus>
  /** Randomized order of indices into deck.cards for this session. */
  cardOrder: number[]
}

/** Create a shuffled array of indices [0..length-1] for random card order. */
function createShuffledOrder(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = indices[i]
    indices[i] = indices[j]
    indices[j] = tmp
  }
  return indices
}

/** Resolve a deck by id from the given list (e.g. DECKS). */
function findDeckById(decks: Deck[], deckId: string): Deck | null {
  return decks.find((d) => d.id === deckId) ?? null
}

/**
 * Encapsulates all study-session state and actions: starting a deck, flipping,
 * recording answers, starting a redo of wrong cards, and going back to deck list.
 * Session is persisted to LocalStorage so refresh preserves progress.
 */
export function useStudySession(decks: Deck[]) {
  const [session, setSession] = useState<SessionState | null>(null)

  // Restore session from LocalStorage on mount (so refresh preserves progress)
  useEffect(() => {
    const persisted = getPersistedSession()
    if (!persisted) return
    const deck = findDeckById(decks, persisted.deckId)
    if (!deck) return
    const fallbackOrder = Array.from({ length: deck.cards.length }, (_, index) => index)
    setSession({
      deck,
      currentIndex: persisted.currentIndex,
      isFlipped: false,
      answers: persisted.answers,
      cardOrder: persisted.cardOrder && persisted.cardOrder.length === deck.cards.length ? persisted.cardOrder : fallbackOrder,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  const startDeck = (deck: Deck) => {
    const cardOrder = createShuffledOrder(deck.cards.length)
    const newSession: SessionState = {
      deck,
      currentIndex: 0,
      isFlipped: false,
      answers: {},
      cardOrder,
    }
    setSession(newSession)
    setPersistedSession({
      deckId: deck.id,
      currentIndex: 0,
      answers: {},
      cardOrder,
    })
  }

  const flip = () => {
    setSession((prev) => (prev ? { ...prev, isFlipped: !prev.isFlipped } : prev))
  }

  const recordAnswer = (status: AnswerStatus) => {
    setSession((prev) => {
      if (!prev) return prev
      const cardIndex = prev.cardOrder[prev.currentIndex]
      const card = prev.deck.cards[cardIndex]
      const nextAnswers: Record<string, AnswerStatus> = {
        ...prev.answers,
        [card.id]: status,
      }
      const isLastCard = prev.currentIndex >= prev.deck.cards.length - 1
      const nextIndex = isLastCard ? prev.currentIndex : prev.currentIndex + 1
      const next: SessionState = isLastCard
        ? { ...prev, answers: nextAnswers, isFlipped: true }
        : {
            ...prev,
            answers: nextAnswers,
            currentIndex: nextIndex,
            isFlipped: false,
          }
      // Persist only normal (non-redo) sessions so refresh restores progress
      if (!prev.isRedoSession) {
        setPersistedSession({
          deckId: prev.deck.id,
          currentIndex: nextIndex,
          answers: nextAnswers,
          cardOrder: prev.cardOrder,
        })
      }
      return next
    })
  }

  const backToDecks = () => {
    setSession(null)
    setPersistedSession(null)
  }

  const currentCard: Card | null = useMemo(() => {
    if (!session) return null
    const index = session.cardOrder[session.currentIndex]
    if (index === undefined) return null
    return session.deck.cards[index] ?? null
  }, [session])

  const totalCards = useMemo(
    () => (session ? session.deck.cards.length : 0),
    [session],
  )

  const answeredCount = useMemo(
    () => (session ? Object.keys(session.answers).length : 0),
    [session],
  )

  const hasCompletedDeck = useMemo(
    () => session !== null && answeredCount === totalCards,
    [session, answeredCount, totalCards],
  )

  const progressPercentage = useMemo(() => {
    if (!session || totalCards === 0) return 0
    return Math.round((answeredCount / totalCards) * 100)
  }, [session, totalCards, answeredCount])

  const incorrectCards = useMemo(() => {
    if (!session) return []
    return session.deck.cards.filter((card) => session.answers[card.id] === 'incorrect')
  }, [session])

  const hasIncorrectCards = incorrectCards.length > 0

  const startRedoWrongCards = () => {
    if (!session) return
    const redoDeck: Deck = {
      ...session.deck,
      cards: incorrectCards,
    }
    const cardOrder = createShuffledOrder(incorrectCards.length)
    setSession({
      deck: redoDeck,
      currentIndex: 0,
      isFlipped: false,
      answers: {},
      isRedoSession: true,
      originalAnswers: { ...session.answers },
      cardOrder,
    })
  }

  return {
    session,
    currentCard,
    totalCards,
    answeredCount,
    hasCompletedDeck,
    progressPercentage,
    incorrectCards,
    hasIncorrectCards,
    startDeck,
    flip,
    recordAnswer,
    backToDecks,
    startRedoWrongCards,
  }
}
