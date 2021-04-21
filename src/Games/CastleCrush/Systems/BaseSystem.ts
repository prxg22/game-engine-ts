import { System } from '../../../Core'
import { CLOCK } from '../constants'
import Factory from '../Factory'

export default class BaseSystem extends System {
  time: number = 0
  factory?: Factory

  get tick(): boolean {
    return this.time < CLOCK
  }

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  update(dt: number) {
    this.time += dt
    if (this.time < CLOCK) return
    this.time = 0
  }
}
