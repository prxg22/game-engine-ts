import { System } from '../../../Core'
import Spatial from '../Components/Spatial'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_SIZE,
  MAX_X,
  MAX_Y,
  TICK
} from '../constants'

export default class PhysicsSystem extends System {
  time: number = 0

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0
    const spatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Spatial]
    )

    spatialEntities.forEach((e) => {
      const spatial = this.entityManager.getComponentOfClass(
        Spatial,
        e
      ) as Spatial

      spatial.x += spatial.dx
      spatial.y += spatial.dy

      spatial.x = Math.max(0, Math.min(spatial.x, MAX_X))
      spatial.y = Math.max(0, Math.min(spatial.y, MAX_Y))
    })
  }
}
