import { GameObjects } from 'phaser'
import { System } from '../../../Core'
import Renderable from '..//Components/Renderable'
import Alive from '../Components/Alive'
import Spatial from '../Components/Spatial'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_SIZE,
  MAX_X,
  MAX_Y,
  NEUTRAL
} from '../constants'

export default class RenderSystem extends System {
  time = 0
  update() {}
  render(dt: number) {
    const spatialAndRenderableEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Spatial, Renderable]
    )

    spatialAndRenderableEntities.forEach((e) => {
      const spatial = this.entityManager.getComponentOfClass(
        Spatial,
        e
      ) as Spatial

      const renderable = this.entityManager.getComponentOfClass(
        Renderable,
        e
      ) as Renderable<GameObjects.Shape>

      const alive = this.entityManager.getComponentOfClass(Alive, e) as Alive

      if (!spatial || !renderable) return

      if (alive && !alive.isAlive) {
        renderable.sprite.setFillStyle(NEUTRAL)
        return
      }

      renderable.sprite.setPosition(
        spatial.x * GRID_SIZE,
        spatial.y * GRID_SIZE
      )
    })
  }
}
