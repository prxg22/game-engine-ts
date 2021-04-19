import { Entity, System } from '../../../Core'
import Deck from '../Components/Deck'
import Hand from '../Components/Hand'
import { TICK } from '../constants'
import Factory from '../Factory'

class DrawSystem extends System {
  private factory?: Factory
  private time: number = 0

  create() {
    const factory = Factory.instance
    this.factory = factory

    const entitiesWithHandAndDeck = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Deck, Hand]
    )

    entitiesWithHandAndDeck.forEach((entity) => {
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck

      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand

      if (!deck || !hand) return
      deck.shuffle()
      const cardsNames = deck.draw(5)
      const cards = cardsNames.map((name) => factory.card(name))

      hand.add(cards)
    })
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0

    const entitiesWithHandAndDeck = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand, Deck]
    )

    entitiesWithHandAndDeck.forEach((entity) => {
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck
      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand
      const [cardName] = deck.draw()

      if (hand.full) return
      const card = this.factory.card(cardName)
      hand.add(card)
    })
  }
}

export default DrawSystem
