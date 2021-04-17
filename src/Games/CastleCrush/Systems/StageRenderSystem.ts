import { Entity, System } from '../../../Core'
import CardDescriptorComponent, {
  CardDescriptor
} from '../Components/CardDescriptorComponent'
import DeckComponent from '../Components/DeckComponent'
import DeckRendererComponent, {
  PlayerDeckRendererComponent
} from '../Components/DeckRendererComponent'
import HandComponent from '../Components/HandComponent'
import HandRendererComponent from '../Components/HandRendererComponent'
import ManaComponent from '../Components/ManaComponent'
import ManaRendererComponent from '../Components/ManaRendererComponent'

class StageRenderSystem extends System {
  update() {}

  renderHand(entity: Entity) {
    const handRenderer = this.entityManager.getComponentOfClass<HandRendererComponent>(
      HandRendererComponent,
      entity
    )

    const hand = this.entityManager.getComponentOfClass<HandComponent>(
      HandComponent,
      entity
    )

    if (handRenderer && hand) {
      const cardDescriptors: CardDescriptor[] = hand.cards.reduce(
        (descriptors: CardDescriptor[], card: Entity): CardDescriptor[] => {
          const descriptor = this.entityManager.getComponentOfClass<CardDescriptorComponent>(
            CardDescriptorComponent,
            card
          )?.descriptor

          if (descriptor) descriptors.push(descriptor)
          return descriptors
        },
        []
      )

      handRenderer.update(cardDescriptors)
    }
  }
  renderDeck(entity: Entity) {
    const deckRenderer = this.entityManager.getComponentOfClass<DeckRendererComponent>(
      DeckRendererComponent,
      entity
    )

    const deck = this.entityManager.getComponentOfClass<DeckComponent>(
      DeckComponent,
      entity
    )

    if (deck && deckRenderer) deckRenderer.renderStatus(deck.status)
  }

  renderMana(entity: Entity) {
    const manaRenderer = this.entityManager.getComponentOfClass<ManaRendererComponent>(
      ManaRendererComponent,
      entity
    )

    const mana = this.entityManager.getComponentOfClass<ManaComponent>(
      ManaComponent,
      entity
    )

    if (!mana || !manaRenderer) return

    manaRenderer.setText(mana.current, mana.max)
  }

  render() {
    const entities = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      DeckRendererComponent
    )

    entities.forEach((entity) => {
      this.renderHand(entity)
      this.renderDeck(entity)
      this.renderMana(entity)
    })
  }
}

export default StageRenderSystem
