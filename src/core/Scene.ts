import Phaser from 'phaser'
import EntityManager from './EntityManager'
import System from './System'

abstract class Scene extends Phaser.Scene {
  entityManager: EntityManager
  systems: System[] = []

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    this.entityManager = new EntityManager()
  }

  create() {
    this.systems.forEach((s) => s.create())
  }

  update(dt?: number, time?: number) {
    this.systems.forEach((s) => {
      s.update(dt)
    })
    this.systems.forEach((s) => {
      s.render(dt)
    })
  }
}

export default Scene
