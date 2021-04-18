import Phaser from 'phaser'
import { Component, Entity, EntityManager, Scene, System } from '../../../Core'
import EntityCollection from '../Components/EntityCollection'
import Renderable from '../Components/Renderable'
import { CANVAS_WIDTH, TICK } from '../constants'
import Factory from '../Factory'
import CollideSystem from '../Systems/CollideSystem'
import InputSystem from '../Systems/InputSystem'
import PhysicsSystem from '../Systems/PhysicsSystem'
import RenderSystem from '../Systems/RenderSystem'
import TickSystem from '../Systems/TickSystem'

class MainScene extends Scene {
  private factory?: Factory
  private text?: Phaser.GameObjects.Text
  private dt: number = 0

  create() {
    this.text = this.add.text(CANVAS_WIDTH + 16, 0, '', {
      fontSize: '10px',
      color: '#fff'
    })
    this.factory = new Factory(this.entityManager, this.add, this.input)
    this.systems = [
      new TickSystem(this.entityManager, this.add, this.input),
      new InputSystem(this.entityManager, this.add, this.input),
      new CollideSystem(this.entityManager, this.add, this.input),
      new PhysicsSystem(this.entityManager, this.add, this.input),
      new RenderSystem(this.entityManager, this.add, this.input)
    ]
    this.factory.frame()
    this.factory.apple()
    this.factory.snake()
    super.create()
  }
}

const debugComponents = (...arr: Component[][]): string => {
  return arr
    .map((componentArray) => {
      return componentArray
        .map((component: Component) => {
          let msg = component.toString()

          if (component instanceof Renderable) {
            msg += `\nsprite.x: ${component.sprite.x}\nsprite.y: ${component.sprite.y}\n`
            return msg
          }

          const buildObjectMessage = (object: { [key: string]: any }) =>
            Object.entries(object)
              .map(([key, value]): string => {
                return `\n${key}: ${value}`
              })
              .join('')

          msg += buildObjectMessage(component)

          return msg
        })
        .join('\n\n')
    })
    .join('\n---------\n')
}

export default MainScene
