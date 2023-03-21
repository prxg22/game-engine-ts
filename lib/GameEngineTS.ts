import EntitiesManager from './EntitiesManager'
import type { System } from './System'
import SystemsManager from './SystemsManager'
import type { InstanceType } from './types'

export default class GameEngineTS {
  systemsManager: SystemsManager
  entitiesManager: EntitiesManager
  private lastDt: number = 0
  constructor(systems: InstanceType<System>[] = []) {
    this.entitiesManager = new EntitiesManager()
    this.systemsManager = new SystemsManager(systems, this.entitiesManager)
    this.loop()
  }

  loop(dt: number = 0) {
    const elapsed = (dt - this.lastDt) / 1000
    this.lastDt = dt
    this.systemsManager.update(elapsed)
    this.systemsManager.render(elapsed)
    requestAnimationFrame((dt) => {
      this.loop(dt)
    })
  }
}
