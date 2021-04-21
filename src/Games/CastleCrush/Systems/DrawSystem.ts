import Deck from '../Components/Deck'
import BaseSystem from './BaseSystem'

class DrawSystem extends BaseSystem {
  create() {
    super.create()
    const deckEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Deck],
    )

    deckEntities.forEach(entity => {
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck

      if (!deck) return
      deck.shuffle()
      deck.draw(5)
    })
  }

  clock() {
    const entitiesWithHandAndDeck = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Deck],
    )

    entitiesWithHandAndDeck.forEach(entity => {
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck
      deck.draw()
    })
  }
}

export default DrawSystem
