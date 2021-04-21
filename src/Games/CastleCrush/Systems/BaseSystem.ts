import { System } from '../../../Core'
import { TICK } from '../constants'
import Factory from '../Factory'

export default class BaseSystem extends System {
  time: number = 0
  factory?: Factory

  get tick(): boolean {
    return this.time < TICK
  }

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0
  }
}
