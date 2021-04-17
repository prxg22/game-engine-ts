import Phaser from 'phaser'
import Cards from '../Cards'
import { Entity, EntityManager, System } from '../../Core'
import { create } from '../Factories/PlayerFactory'
import ManaSystem from '../Systems/ManaSystem'
import DrawSystem from '../Systems/DrawSystem'
import StageRenderSystem from '../Systems/StageRenderSystem'

const TICK = 1000

const player = {
  hp: 5000,
  cards: [
    Cards['creature-1'],
    Cards['creature-1'],
    Cards['creature-1'],
    Cards['creature-1'],
    Cards['creature-1'],
    Cards['creature-1']
  ]
}
class BattleScene extends Phaser.Scene {
  private lastTime: number = 0
  private tick: number = 0
  private human?: Entity
  private entityManager: EntityManager
  private systems: System[] = []

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)

    this.entityManager = new EntityManager()

    this.systems.push(new DrawSystem(this.entityManager))
    this.systems.push(new ManaSystem(this.entityManager))
    this.systems.push(new StageRenderSystem(this.entityManager))
  }

  create() {
    this.human = create(player, this.entityManager, this)
    this.systems.forEach((s) => s.create())
  }

  preload() {
    this.systems.forEach((s) => s.preload())
  }

  update(dt: number) {
    if (dt >= 15000) {
      this.game.destroy(false)
      return
    }
    if (dt - this.lastTime >= TICK) {
      this.lastTime = dt
      this.systems.forEach((system) => system.update(this.tick))
      this.tick += 1
    }
    this.systems.forEach((system) => system.render(dt))
  }
}

export default BattleScene
