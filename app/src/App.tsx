import { useMemo, useState } from 'react'
import './App.css'
import { DECKS } from './data/decks'
import type { Card, Deck } from './types/flashcards'
import { Flashcard } from './components/Flashcard'

type AnswerStatus = 'correct' | 'incorrect'

type SessionState = {
  deck: Deck
  currentIndex: number
  isFlipped: boolean
  answers: Record<string, AnswerStatus>
}

function App() {
  const [session, setSession] = useState<SessionState | null>(null)

  const handleStartDeck = (deck: Deck) => {
    setSession({
      deck,
      currentIndex: 0,
      isFlipped: false,
      answers: {},
    })
  }

  const handleFlip = () => {
    setSession((prev) => (prev ? { ...prev, isFlipped: !prev.isFlipped } : prev))
  }

  const handleAnswer = (status: AnswerStatus) => {
    setSession((prev) => {
      if (!prev) return prev
      const card = prev.deck.cards[prev.currentIndex]
      const nextAnswers: Record<string, AnswerStatus> = {
        ...prev.answers,
        [card.id]: status,
      }
      const isLastCard = prev.currentIndex >= prev.deck.cards.length - 1

      if (isLastCard) {
        return {
          ...prev,
          answers: nextAnswers,
          isFlipped: true,
        }
      }

      return {
        ...prev,
        answers: nextAnswers,
        currentIndex: prev.currentIndex + 1,
        isFlipped: false,
      }
    })
  }

  const handleBackToDecks = () => {
    setSession(null)
  }

  const currentCard: Card | null = useMemo(() => {
    if (!session) return null
    return session.deck.cards[session.currentIndex] ?? null
  }, [session])

  const hasCompletedDeck = useMemo(() => {
    if (!session) return false
    const totalCards = session.deck.cards.length
    return Object.keys(session.answers).length === totalCards
  }, [session])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Spanish Flashcards</h1>
        <p className="app-tagline">Practice decks, flip cards, and mark what you know.</p>
      </header>

      {!session && (
        <main className="app-main">
          <section className="deck-selection">
            <h2 className="section-title">Choose a deck</h2>
            <p className="section-subtitle">Start with a topic and go through each card in the deck.</p>
            <div className="deck-list">
              {DECKS.map((deck) => (
                <button key={deck.id} type="button" className="deck-card" onClick={() => handleStartDeck(deck)}>
                  <h3 className="deck-card__title">{deck.name}</h3>
                  {deck.description && <p className="deck-card__description">{deck.description}</p>}
                  <p className="deck-card__meta">
                    {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {session && currentCard && (
        <main className="app-main">
          <section className="study-header">
            <button type="button" className="back-link" onClick={handleBackToDecks}>
              ← All decks
            </button>
            <div className="study-header__meta">
              <h2 className="section-title">{session.deck.name}</h2>
              <p className="study-progress">
                Card {session.currentIndex + 1} of {session.deck.cards.length}
              </p>
            </div>
          </section>

          <section className="study-area">
            <Flashcard card={currentCard} isFlipped={session.isFlipped} onToggle={handleFlip} />

            {session.isFlipped && !hasCompletedDeck && (
              <div className="answer-actions">
                <p className="answer-actions__label">How did you do?</p>
                <div className="answer-actions__buttons">
                  <button type="button" className="answer-button answer-button--correct" onClick={() => handleAnswer('correct')}>
                    I was correct
                  </button>
                  <button type="button" className="answer-button answer-button--incorrect" onClick={() => handleAnswer('incorrect')}>
                    I need to review
                  </button>
                </div>
              </div>
            )}

            {hasCompletedDeck && (
              <div className="session-summary">
                <h3 className="session-summary__title">Session complete</h3>
                <p className="session-summary__text">
                  You have marked each card as correct or needs review. You can go back to choose another deck.
                </p>
                <button type="button" className="primary-button" onClick={handleBackToDecks}>
                  Back to decks
                </button>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App
