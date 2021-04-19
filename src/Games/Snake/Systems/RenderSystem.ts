import { GameObjects } from 'phaser'
import { System } from '../../../Core'
import Renderable from '..//Components/Renderable'
import Alive from '../Components/Alive'
import Spatial from '../Components/Spatial'
import {
  GRID_SIZE,
  SNAKE_FRAME_DOWN,
  SNAKE_FRAME_LEFT,
  SNAKE_FRAME_RIGHT,
  SNAKE_FRAME_UP,
  VELOCITY
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
      ) as Renderable<GameObjects.Sprite>

      const alive = this.entityManager.getComponentOfClass(Alive, e) as Alive

      if (!spatial || !renderable) return

      if (e === this.entityManager.getEntityByTag('snake')) {
        switch (spatial.dx) {
          case VELOCITY:
            renderable.sprite.setFrame(SNAKE_FRAME_RIGHT)
            break
          case -VELOCITY:
            renderable.sprite.setFrame(SNAKE_FRAME_LEFT)
            break
        }

        switch (spatial.dy) {
          case -VELOCITY:
            renderable.sprite.setFrame(SNAKE_FRAME_UP)
            break
          case VELOCITY:
            renderable.sprite.setFrame(SNAKE_FRAME_DOWN)
            break
        }
      }

      renderable.sprite.setPosition(
        spatial.x * GRID_SIZE,
        spatial.y * GRID_SIZE
      )
    })
  }
}
