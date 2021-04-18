import Phaser, { GameObjects } from 'phaser'
import { Component, Entity, EntityManager, Scene, System } from '../../../Core'
import images from '../Assets/Images/*.png'
import Engine from '../Components/Engine'
import Renderable from '../Components/Renderable'
import { createPlayer } from '../Factory'
import EngineSystem from '../Systems/EngineSystem'
import InputSystem from '../Systems/InputSystem'
import PhysicsSystem from '../Systems/PhysicsSystem'
import RenderingSystem from '../Systems/RenderingSystem'

class MainScene extends Scene {
  player?: Entity
  private debug?: Phaser.GameObjects.Text
  preload() {
    this.load.spritesheet('ship', images.ship, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('explosion', images.explosion, {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('ground', images.ground)
  }

  create() {
    this.player = createPlayer(this.entityManager, this.add, this.input)

    this.systems = [
      new InputSystem(this.entityManager, this.add, this.input),
      new EngineSystem(this.entityManager, this.add, this.input),
      new PhysicsSystem(this.entityManager, this.add, this.input),
      new RenderingSystem(this.entityManager, this.add, this.input)
    ]

    const engine = this.entityManager.getComponentOfClass<Engine>(
      Engine,
      this.player
    )
    const render = this.entityManager.getComponentOfClass<
      Renderable<GameObjects.Sprite>
    >(Renderable, this.player)

    this.debug = this.add.text(
      0,
      0,
      debugComponents(this.entityManager.getComponents(this.player)),
      { color: 'white', fontSize: '12pxaadss' }
    )
  }

  update(time: number, dt: number) {
    if (time >= 60000) return
    const player = this.entityManager.getComponents(this.player || 0)

    this.debug?.setText(debugComponents(player))
    super.update(dt)
  }
}

const debugComponents = (arr: Component[]): string => {
  return arr
    .map((component: Component) => {
      let msg = component.toString()

      msg += Object.entries(component)
        .map(([key, value]): string => {
          return `\n${key}: ${value}`
        })
        .join('')

      return msg
    })
    .join('\n\n')
}

export default MainScene
