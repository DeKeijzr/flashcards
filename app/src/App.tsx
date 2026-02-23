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
  const study = useStudySession()
  const { session, currentCard, hasCompletedDeck, progressPercentage, incorrectCards, hasIncorrectCards } = study

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Spanish Flashcards</h1>
        <p className="app-tagline">Practice decks, flip cards, and mark what you know.</p>
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
