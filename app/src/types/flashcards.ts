/**
 * Core domain types for the Spanish flashcards app.
 * Card represents a single vocabulary item; Deck is a named collection of cards.
 */

/** A single flashcard: Spanish term, English translation, and optional pronunciation hint. */
export type Card = {
  id: string
  spanish: string
  english: string
  pronunciation?: string
}

/** A study deck: id, display name, optional description, and list of cards. */
export type Deck = {
  id: string
  name: string
  description?: string
  cards: Card[]
}
