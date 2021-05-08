import Phaser from 'phaser'
import { Scene } from '../../../Core'
import { CLOCK } from '../constants'
import BaseEntityManager from './BaseEntityManager'
import BaseSystem from './BaseSystem'

export default class BaseScene extends Scene {
  systems: BaseSystem[] = []
  entityManager: BaseEntityManager

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    this.entityManager = new BaseEntityManager()
  }

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
