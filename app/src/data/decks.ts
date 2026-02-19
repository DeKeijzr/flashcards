import type { Card, Deck } from '../types/flashcards'

const makeCard = (id: string, spanish: string, english: string, pronunciation?: string): Card => ({
  id,
  spanish,
  english,
  pronunciation,
})

export const DECKS: Deck[] = [
  {
    id: 'food',
    name: 'Comida (Food)',
    description: 'Common food-related vocabulary',
    cards: [
      makeCard('food-1', 'la manzana', 'apple'),
      makeCard('food-2', 'el pan', 'bread'),
      makeCard('food-3', 'el queso', 'cheese'),
      makeCard('food-4', 'el café', 'coffee'),
      makeCard('food-5', 'el agua', 'water'),
    ],
  },
  {
    id: 'travel',
    name: 'Viajes (Travel)',
    description: 'Words you will use while traveling',
    cards: [
      makeCard('travel-1', 'el aeropuerto', 'airport'),
      makeCard('travel-2', 'el boleto', 'ticket'),
      makeCard('travel-3', 'la maleta', 'suitcase'),
      makeCard('travel-4', 'el taxi', 'taxi'),
      makeCard('travel-5', 'el mapa', 'map'),
    ],
  },
]

