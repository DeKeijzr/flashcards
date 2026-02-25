import type { SessionState } from '../hooks/useStudySession'
import type { Card } from '../types/flashcards'
import { Flashcard } from './Flashcard'
import { pluralize } from '../utils/pluralize'

export type StudySessionProps = {
  session: SessionState
  currentCard: Card
  hasCompletedDeck: boolean
  progressPercentage: number
  incorrectCards: Card[]
  hasIncorrectCards: boolean
  level: 'easy' | 'hard'
  onFlip: () => void
  onAnswer: (status: 'correct' | 'incorrect') => void
  onBackToDecks: () => void
  onStartRedoWrongCards: () => void
}

/**
 * Renders the active study view: header with progress, current flashcard,
 * correct/incorrect actions, and session-complete summary (with optional redo).
 */
export function StudySession({
  session,
  currentCard,
  hasCompletedDeck,
  progressPercentage,
  incorrectCards,
  hasIncorrectCards,
  level,
  onFlip,
  onAnswer,
  onBackToDecks,
  onStartRedoWrongCards,
}: StudySessionProps) {
  const deckTitle = session.isRedoSession
    ? `${session.deck.name} - Review`
    : session.deck.name

  return (
    <main className="app-main">
      <section className="study-header">
        <button type="button" className="back-link" onClick={onBackToDecks}>
          ← All decks
        </button>
        <div className="study-header__meta">
          <h2 className="section-title">{deckTitle}</h2>
          <p className="study-progress">
            Card {session.currentIndex + 1} of {session.deck.cards.length} ({progressPercentage}%)
          </p>
          {!session.isRedoSession && (
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          )}
        </div>
      </section>

      <section className="study-area">
        <Flashcard card={currentCard} isFlipped={session.isFlipped} onToggle={onFlip} level={level} />

        {session.isFlipped && !hasCompletedDeck && (
          <div className="answer-actions">
            <p className="answer-actions__label">How did you do?</p>
            <div className="answer-actions__buttons">
              <button
                type="button"
                className="answer-button answer-button--correct"
                onClick={() => onAnswer('correct')}
              >
                I was correct
              </button>
              <button
                type="button"
                className="answer-button answer-button--incorrect"
                onClick={() => onAnswer('incorrect')}
              >
                I need to review
              </button>
            </div>
          </div>
        )}

        {hasCompletedDeck && (
          <div className="session-summary">
            <h3 className="session-summary__title">Session complete</h3>
            <p className="session-summary__text">
              {session.isRedoSession
                ? `You've reviewed ${session.deck.cards.length} ${pluralize(session.deck.cards.length, 'card', 'cards')} that needed practice.`
                : `You've completed all ${session.deck.cards.length} cards in this deck.`}
            </p>
            <div className="session-summary__actions">
              {!session.isRedoSession && hasIncorrectCards && (
                <>
                  <p className="session-summary__subtext">
                    {incorrectCards.length} {pluralize(incorrectCards.length, 'card', 'cards')} marked
                    as needing review.
                  </p>
                  <button
                    type="button"
                    className="primary-button redo-button"
                    onClick={onStartRedoWrongCards}
                  >
                    Redo Wrong Cards
                  </button>
                </>
              )}
              <button type="button" className="primary-button" onClick={onBackToDecks}>
                Back to decks
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
