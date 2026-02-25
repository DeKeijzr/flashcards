import { useState } from 'react'
import './App.css'
import { DECKS } from './data/decks'
import { useStudySession } from './hooks/useStudySession'
import { DeckSelection } from './components/DeckSelection'
import { StudySession } from './components/StudySession'

/**
 * Root app: shows deck selection or an active study session.
 * Session state and study flow are delegated to useStudySession.
 */
function App() {
  const [level, setLevel] = useState<'easy' | 'hard'>('hard')
  const study = useStudySession(DECKS)
  const { session, currentCard, hasCompletedDeck, progressPercentage, incorrectCards, hasIncorrectCards } = study

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Spanish Flashcards</h1>
        <p className="app-tagline">Practice decks, flip cards, and mark what you know.</p>
        <div className="level-toggle" aria-label="Difficulty level">
          <span className="level-toggle__label">Level:</span>
          <div className="level-toggle__buttons" role="radiogroup" aria-label="Select difficulty level">
            <button
              type="button"
              className={`level-toggle__button ${level === 'easy' ? 'level-toggle__button--active' : ''}`}
              role="radio"
              aria-checked={level === 'easy'}
              onClick={() => setLevel('easy')}
            >
              Easy
            </button>
            <button
              type="button"
              className={`level-toggle__button ${level === 'hard' ? 'level-toggle__button--active' : ''}`}
              role="radio"
              aria-checked={level === 'hard'}
              onClick={() => setLevel('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      </header>

      {!session && (
        <DeckSelection decks={DECKS} onSelectDeck={study.startDeck} />
      )}

      {session && currentCard && (
        <StudySession
          session={session}
          currentCard={currentCard}
          hasCompletedDeck={hasCompletedDeck}
          progressPercentage={progressPercentage}
          incorrectCards={incorrectCards}
          hasIncorrectCards={hasIncorrectCards}
          level={level}
          onFlip={study.flip}
          onAnswer={study.recordAnswer}
          onBackToDecks={study.backToDecks}
          onStartRedoWrongCards={study.startRedoWrongCards}
        />
      )}
    </div>
  )
}

export default App
