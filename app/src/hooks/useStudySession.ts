import { useMemo, useState } from 'react'
import type { Card, Deck } from '../types/flashcards'

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
}

/**
 * Encapsulates all study-session state and actions: starting a deck, flipping,
 * recording answers, starting a redo of wrong cards, and going back to deck list.
 * Derived values (currentCard, progress, incorrectCards, etc.) are memoized.
 */
export function useStudySession() {
  const [session, setSession] = useState<SessionState | null>(null)

  const startDeck = (deck: Deck) => {
    setSession({
      deck,
      currentIndex: 0,
      isFlipped: false,
      answers: {},
    })
  }

  const flip = () => {
    setSession((prev) => (prev ? { ...prev, isFlipped: !prev.isFlipped } : prev))
  }

  const recordAnswer = (status: AnswerStatus) => {
    setSession((prev) => {
      if (!prev) return prev
      const card = prev.deck.cards[prev.currentIndex]
      const nextAnswers: Record<string, AnswerStatus> = {
        ...prev.answers,
        [card.id]: status,
      }
      const isLastCard = prev.currentIndex >= prev.deck.cards.length - 1

      if (isLastCard) {
        return { ...prev, answers: nextAnswers, isFlipped: true }
      }

      return {
        ...prev,
        answers: nextAnswers,
        currentIndex: prev.currentIndex + 1,
        isFlipped: false,
      }
    })
  }

  const backToDecks = () => {
    setSession(null)
  }

  const currentCard: Card | null = useMemo(() => {
    if (!session) return null
    return session.deck.cards[session.currentIndex] ?? null
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
    setSession({
      deck: redoDeck,
      currentIndex: 0,
      isFlipped: false,
      answers: {},
      isRedoSession: true,
      originalAnswers: { ...session.answers },
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
