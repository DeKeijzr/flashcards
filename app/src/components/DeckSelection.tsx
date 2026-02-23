import type { Deck } from '../types/flashcards'
import { pluralize } from '../utils/pluralize'

type DeckSelectionProps = {
  decks: Deck[]
  onSelectDeck: (deck: Deck) => void
}

/** Renders the list of decks so the user can pick one to study. */
export function DeckSelection({ decks, onSelectDeck }: DeckSelectionProps) {
  return (
    <main className="app-main">
      <section className="deck-selection">
        <h2 className="section-title">Choose a deck</h2>
        <p className="section-subtitle">Start with a topic and go through each card in the deck.</p>
        <div className="deck-list">
          {decks.map((deck) => (
            <button
              key={deck.id}
              type="button"
              className="deck-card"
              onClick={() => onSelectDeck(deck)}
            >
              <h3 className="deck-card__title">{deck.name}</h3>
              {deck.description && (
                <p className="deck-card__description">{deck.description}</p>
              )}
              <p className="deck-card__meta">
                {deck.cards.length} {pluralize(deck.cards.length, 'card', 'cards')}
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
