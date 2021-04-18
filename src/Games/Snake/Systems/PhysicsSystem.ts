import { System } from '../../../Core'
import EntityCollection from '../Components/EntityCollection'
import Spatial from '../Components/Spatial'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_SIZE,
  MAX_X,
  MAX_Y,
  TICK
} from '../constants'
import TickSystem from './TickSystem'

export default class PhysicsSystem extends System {
  time: number = 0

  update(dt: number) {
    this.time += dt
    if (this.time < TickSystem.tick) return
    this.time = 0

    const snake = this.entityManager.getEntityByTag('snake')

    if (!snake) return
    const spatial = this.entityManager.getComponentOfClass(
      Spatial,
      snake
    ) as Spatial

    const bodyParts = this.entityManager.getComponentOfClass(
      EntityCollection,
      snake
    ) as EntityCollection

    const position = { x: spatial.x, y: spatial.y }
    bodyParts.entities.forEach((bodyPart) => {
      const bodyPartSpatial = this.entityManager.getComponentOfClass(
        Spatial,
        bodyPart
      ) as Spatial

      if (!bodyPartSpatial) return

      const [x, y] = [bodyPartSpatial.x, bodyPartSpatial.y]
      bodyPartSpatial.x = position.x
      bodyPartSpatial.y = position.y
      position.x = x
      position.y = y
    })
    spatial.x += spatial.dx
    spatial.y += spatial.dy

    spatial.x = Math.max(0, Math.min(spatial.x, MAX_X))
    spatial.y = Math.max(0, Math.min(spatial.y, MAX_Y))
  }
}
