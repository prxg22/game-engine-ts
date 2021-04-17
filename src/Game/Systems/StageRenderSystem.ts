import { Entity, System } from '../../Core'
import DeckComponent from '../Components/DeckComponent'
import DeckRendererComponent, {
  PlayerDeckRendererComponent
} from '../Components/DeckRendererComponent'
import ManaComponent from '../Components/ManaComponent'
import ManaRendererComponent from '../Components/ManaRendererComponent'

class StageRenderSystem extends System {
  update() {}

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
      this.renderDeck(entity)
      this.renderMana(entity)
    })
  }
}

export default StageRenderSystem
