import { Entity, System } from '../../Core'
import DeckComponent, { DECK_STATUS } from '../Components/DeckComponent'
import DeckRendererComponent, {
  PlayerDeckRendererComponent
} from '../Components/DeckRendererComponent'
import HandComponent from '../Components/HandComponent'

class DrawSystem extends System {
  get entitiesWithDeckComponent(): Entity[] {
    return this.entityManager.getAllEntitiesPosessingComponentOfClass<DeckComponent>(
      DeckComponent
    )
  }

  get entitiesWithDeckRendererComponent(): Entity[] {
    return this.entityManager.getAllEntitiesPosessingComponentOfClass<DeckComponent>(
      DeckRendererComponent
    )
  }

  create() {
    this.entitiesWithDeckComponent.forEach((entity) => {
      const deck = this.entityManager.getComponentOfClass<DeckComponent>(
        DeckComponent,
        entity
      )

      const hand = this.entityManager.getComponentOfClass<HandComponent>(
        HandComponent,
        entity
      )

      if (!deck || !hand) return
      deck.shuffle()
      // hand.addCards(deck.draw(5))
    })
  }

  update(tick: number) {
    this.entitiesWithDeckComponent.forEach((entity) => {
      const deck = this.entityManager.getComponentOfClass<DeckComponent>(
        DeckComponent,
        entity
      )

      if (deck && deck?.status !== DECK_STATUS.INITIAL) {
        deck.status = DECK_STATUS.INITIAL
        return
      }

      if (!(tick % 3) || !deck) return

      const hand = this.entityManager.getComponentOfClass<HandComponent>(
        HandComponent,
        entity
      )

      if (!hand) return

      const card = deck.draw()

      if (!hand.full) {
        deck.status = DECK_STATUS.DRAWING_CARD
        hand.addCards(card)
        return
      }

      deck.status = DECK_STATUS.DROPPING_CARD
    })
  }
}

export default DrawSystem
