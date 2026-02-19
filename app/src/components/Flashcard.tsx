import type { Card } from '../types/flashcards'
import './Flashcard.css'

type FlashcardProps = {
  card: Card
  isFlipped: boolean
  onToggle: () => void
}

export function Flashcard({ card, isFlipped, onToggle }: FlashcardProps) {
  return (
    <div className="flashcard-wrapper">
      <button type="button" className={`flashcard ${isFlipped ? 'flashcard--flipped' : ''}`} onClick={onToggle}>
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__label">Español</span>
            <div className="flashcard__text">{card.spanish}</div>
          </div>
          <div className="flashcard__face flashcard__face--back">
            <span className="flashcard__label">Inglés</span>
            <div className="flashcard__text">{card.english}</div>
            {card.pronunciation && <div className="flashcard__pronunciation">{card.pronunciation}</div>}
          </div>
        </div>
      </button>
      <p className="flashcard__hint">Click the card to flip</p>
    </div>
  )
}

