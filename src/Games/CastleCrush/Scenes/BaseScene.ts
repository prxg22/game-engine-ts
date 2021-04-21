import { Scene } from '../../../Core'
import MainScene from '../../CastleCrush/Scenes/MainScene'
import { CLOCK } from '../constants'
import BaseSystem from '../Systems/BaseSystem'

export default class BaseScene extends Scene {
  systems: BaseSystem[] = []

  update(time: number, dt: number) {
    this.systems.forEach(system => {
      system.dtClock += dt
      if (system.dtClock > CLOCK) {
        system.clock(dt)
        system.dtClock = 0
      }

      super.update(time, dt)
    })
  }
}
