import type { Card } from '../types/flashcards'
import './Flashcard.css'

type FlashcardProps = {
  card: Card
  isFlipped: boolean
  onToggle: () => void
  level: 'easy' | 'hard'
}

/** Return a simple illustration (emoji) for cards with tangible meanings, or null if none. */
function getIllustration(card: Card): string | null {
  const text = card.spanish.toLowerCase()

  // Food & drinks
  if (text.includes('manzana')) return '🍎'
  if (text.includes('pan')) return '🍞'
  if (text.includes('queso rallado') || text.includes('queso')) return '🧀'
  if (text.includes('café')) return '☕'
  if (text.includes('agua')) return '💧'
  if (text.includes('sal')) return '🧂'
  if (text.includes('azúcar')) return '🧁'
  if (text.includes('pimienta')) return '🌶️'
  if (text.includes('aceite')) return '🫙'
  if (text.includes('mantequilla')) return '🧈'
  if (text.includes('huevo')) return '🥚'
  if (text.includes('arroz')) return '🍚'
  if (text.includes('frijoles')) return '🫘'
  if (text.includes('pollo')) return '🍗'
  if (text.includes('carne')) return '🥩'
  if (text.includes('pescado')) return '🐟'
  if (text.includes('sopa')) return '🥣'
  if (text.includes('ensalada')) return '🥗'
  if (text.includes('fruta')) return '🍓'
  if (text.includes('verdura')) return '🥦'
  if (text.includes('naranja')) return '🍊'
  if (text.includes('banana') || text.includes('plátano')) return '🍌'
  if (text.includes('fresa')) return '🍓'
  if (text.includes('uva')) return '🍇'
  if (text.includes('tomate')) return '🍅'
  if (text.includes('cebolla')) return '🧅'
  if (text.includes('ajo')) return '🧄'
  if (text.includes('maíz')) return '🌽'
  if (text.includes('postre')) return '🍰'

  // Animals
  if (text.includes('perro')) return '🐶'
  if (text.includes('gato')) return '🐱'
  if (text.includes('pájaro')) return '🐦'
  if (text.includes('caballo')) return '🐴'
  if (text.includes('vaca')) return '🐄'
  if (text.includes('cerdo')) return '🐖'
  if (text.includes('oveja')) return '🐑'
  if (text.includes('cabra')) return '🐐'
  if (text.includes('conejo')) return '🐇'
  if (text.includes('león')) return '🦁'
  if (text.includes('tigre')) return '🐯'
  if (text.includes('mono')) return '🐒'
  if (text.includes('elefante')) return '🐘'
  if (text.includes('jirafa')) return '🦒'
  if (text.includes('lobo')) return '🐺'
  if (text.includes('oso')) return '🐻'
  if (text.includes('zorro')) return '🦊'
  if (text.includes('delfín')) return '🐬'
  if (text.includes('ballena')) return '🐋'
  if (text.includes('tiburón')) return '🦈'
  if (text.includes('búho')) return '🦉'
  if (text.includes('mariposa')) return '🦋'

  // Body parts
  if (text.includes('cabeza')) return '🧑‍🦱'
  if (text.includes('ojo')) return '👁️'
  if (text.includes('nariz')) return '👃'
  if (text.includes('boca')) return '👄'
  if (text.includes('mano')) return '✋'
  if (text.includes('pie')) return '🦶'
  if (text.includes('corazón')) return '❤️'

  // Clothing
  if (text.includes('camisa')) return '👔'
  if (text.includes('camiseta')) return '👕'
  if (text.includes('blusa')) return '👚'
  if (text.includes('pantalones')) return '👖'
  if (text.includes('falda')) return '🩳'
  if (text.includes('vestido')) return '👗'
  if (text.includes('zapatos')) return '👟'
  if (text.includes('botas')) return '🥾'
  if (text.includes('sandalias')) return '🩴'
  if (text.includes('calcetines')) return '🧦'
  if (text.includes('chaqueta') || text.includes('abrigo')) return '🧥'
  if (text.includes('sombrero')) return '👒'
  if (text.includes('gorra')) return '🧢'
  if (text.includes('bufanda')) return '🧣'
  if (text.includes('gafas de sol')) return '🕶️'

  // House & tools
  if (text.includes('mesa')) return '🪑'
  if (text.includes('silla')) return '🪑'
  if (text.includes('cama')) return '🛏️'
  if (text.includes('sofá')) return '🛋️'
  if (text.includes('lámpara')) return '💡'
  if (text.includes('ventana')) return '🪟'
  if (text.includes('puerta')) return '🚪'
  if (text.includes('refrigerador')) return '🧊'
  if (text.includes('estufa') || text.includes('horno')) return '🍳'
  if (text.includes('microondas')) return '📡'
  if (text.includes('inodoro')) return '🚽'
  if (text.includes('lavabo')) return '🚰'
  if (text.includes('espejo')) return '🪞'
  if (text.includes('almohada')) return '🛌'
  if (text.includes('planta')) return '🪴'

  // Transport
  if (text.includes('coche') || text.includes('carro')) return '🚗'
  if (text.includes('autobús')) return '🚌'
  if (text.includes('tren')) return '🚆'
  if (text.includes('metro')) return '🚇'
  if (text.includes('bicicleta')) return '🚲'
  if (text.includes('moto')) return '🏍️'
  if (text.includes('avión')) return '✈️'
  if (text.includes('barco') || text.includes('ferry') || text.includes('crucero')) return '🛳️'

  // Music & reggaeton objects
  if (text.includes('guitarra')) return '🎸'
  if (text.includes('piano')) return '🎹'
  if (text.includes('batería')) return '🥁'
  if (text.includes('micrófono')) return '🎤'
  if (text.includes('amplificador')) return '📢'
  if (text.includes('botella')) return '🍾'
  if (text.includes('trago')) return '🥃'

  return null
}

/** Renders a single flipable card: front (Spanish) and back (English + optional pronunciation). */
export function Flashcard({ card, isFlipped, onToggle, level }: FlashcardProps) {
  const illustration = level === 'easy' ? getIllustration(card) : null

  return (
    <div className="flashcard-wrapper">
      <button type="button" className={`flashcard ${isFlipped ? 'flashcard--flipped' : ''}`} onClick={onToggle}>
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__label">Español</span>
            {illustration && (
              <div className="flashcard__illustration" aria-hidden="true">
                {illustration}
              </div>
            )}
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

