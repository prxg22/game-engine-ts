import Phaser from "phaser"
import EntityManager from "./core/EntityManager"
import Entity from "./core/Entity"
import System from "./core/System"
import HealthComponent from "./game/HealthComponent"
import RenderComponent from "./game/RenderComponent"
import HealthSystem from "./game/HealthSystem"

// Scene
class MainScene extends Phaser.Scene {
  entityManager?: EntityManager
  player?: Entity
  systems: System[] = []
  private _lastTime: number = 0

  preload() {
    console.log("preload")
  }

  createPlayer(): Entity {
    const player = <Entity>this.entityManager?.createEntity()

    this.entityManager?.addComponent(
      new HealthComponent(100, 100, this.add.text(0, 0, "")),
      player
    )

    const rectangle = this.add.rectangle(100, 100, 80, 80, 0x00ff00)
    this.entityManager?.addComponent(new RenderComponent(rectangle), player)

    console.log(rectangle)
    return player
  }

  create() {
    this.entityManager = new EntityManager()
    this.systems.push(new HealthSystem(this.entityManager, this))
    this.player = this.createPlayer()
  }

  update(dt: number) {
    if (dt - this._lastTime < 1000) return

    this._lastTime = dt
    this.systems.forEach((s) => s.update(dt))

    this.systems.forEach((s) => {
      s.render(dt)
    })
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "content",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  backgroundColor: "transparent",
  scene: MainScene
})
