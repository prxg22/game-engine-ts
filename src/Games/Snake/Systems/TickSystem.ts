import { System } from '../../../Core'
import EntityCollection from '../Components/EntityCollection'
import { TICK } from '../constants'

let tick: number = TICK
export default class TickSystem extends System {
  time: number = 0
  lastLevel: number = 0

  static get tick(): number {
    return tick
  }

  update(dt: number) {
    this.time += dt
    if (this.time >= tick) return
    this.time = 0

    const snake = this.entityManager.getEntityByTag('snake')
    if (!snake) return
    const bodyParts = this.entityManager.getComponentOfClass(
      EntityCollection,
      snake,
    ) as EntityCollection

    const level = bodyParts.entities.length
    if (!level) return
    if (level != this.lastLevel) {
      this.lastLevel = level
      tick -= 0.05
    }
  }
}
