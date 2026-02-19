export type Card = {
  id: string
  spanish: string
  english: string
  pronunciation?: string
}

export type Deck = {
  id: string
  name: string
  description?: string
  cards: Card[]
}

