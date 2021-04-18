import { GameObjects } from 'phaser'
import { System } from '../../../Core'
import Engine from '../Components/Engine'
import Fuel from '../Components/Fuel'
import Renderable from '../Components/Renderable'
import SpatialState from '../Components/SpatialState'

class RenderingSystem extends System {
  update() {}
  render(delta: number) {
    const spatialEntitiesAndRenderable = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [SpatialState, Renderable]
    )

    spatialEntitiesAndRenderable.forEach((entity) => {
      const spatial = this.entityManager.getComponentOfClass<SpatialState>(
        SpatialState,
        entity
      )
      const renderable = this.entityManager.getComponentOfClass<
        Renderable<GameObjects.Sprite | GameObjects.Image>
      >(Renderable, entity)

      if (!spatial || !renderable) return

      renderable.sprite.x = spatial.x
      renderable.sprite.y = spatial.y

      renderable.sprite.setRotation(renderable.rotation)
    })

    const engineEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Engine]
    )

    engineEntities.forEach((entity) => {
      const engine = this.entityManager.getComponentOfClass<Engine>(
        Engine,
        entity
      )
      const renderable = this.entityManager.getComponentOfClass<
        Renderable<GameObjects.Sprite>
      >(Renderable, entity)

      if (!engine || !renderable) return
    })
  }
}

export default RenderingSystem
