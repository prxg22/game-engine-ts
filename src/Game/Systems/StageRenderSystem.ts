import { System } from '../../Core'
import DeckComponent from '../Components/DeckComponent'
import DeckRendererComponent, {
  PlayerDeckRendererComponent
} from '../Components/DeckRendererComponent'

class StageRenderSystem extends System {
  update() {}

  render() {
    const entities = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      DeckRendererComponent
    )

    entities.forEach((entity) => {
      const deckRenderer = this.entityManager.getComponentOfClass<DeckRendererComponent>(
        DeckRendererComponent,
        entity
      )

      const deck = this.entityManager.getComponentOfClass<DeckComponent>(
        DeckComponent,
        entity
      )

      if (!deck || !deckRenderer) return
      deckRenderer.renderStatus(deck.status)
    })
  }
}

export default StageRenderSystem
