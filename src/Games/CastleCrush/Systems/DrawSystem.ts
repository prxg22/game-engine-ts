import { Entity, System } from '../../../Core'
import Deck from '../Components/Deck'
import { TICK } from '../constants'
import Factory from '../Factory'

class DrawSystem extends System {
  private factory?: Factory
  private time: number = 0

  create() {
    const factory = Factory.instance
    this.factory = factory

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

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0

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
