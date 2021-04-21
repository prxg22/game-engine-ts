import { System } from '../../../Core'
import { CLOCK } from '../constants'
import Factory from '../Factory'

export default abstract class BaseSystem extends System {
  dtClock: number = 0
  factory?: Factory

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  clock(dt: number) {}

  update(dt: number) {}
}
