import { System } from '../../../Core'
import { CLOCK } from '../constants'
import Factory from '../Factory'

export default class BaseSystem extends System {
  dtClock: number = 0
  factory?: Factory

  get clock(): boolean {
    return this.dtClock < CLOCK
  }

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  update(dt: number) {
    this.dtClock += dt
    if (this.dtClock < CLOCK) return
    this.dtClock = 0
  }
}
