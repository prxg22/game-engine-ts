import { GameObjects } from 'phaser'
import { Component, Scene } from '../../../Core'
import Renderer from '../Components/Renderer'
import { CANVAS_WIDTH } from '../constants'
import Factory from '../Factory'
import DrawSystem from '../Systems/DrawSystem'
import HandSystem from '../Systems/HandSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'

const TICK = 1000

export default class MainScene extends Scene {
  facotry?: Factory
  text?: GameObjects.Text

  create() {
    this.facotry = new Factory(this.entityManager, this.add, this.input)
    this.text = this.add.text(CANVAS_WIDTH + 1, 0, '', {
      color: '#fff',
      fontSize: '10px'
    })

    // create entities
    this.facotry.player()

    this.systems = [
      new LaneMovementSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input)
    ]

    super.create()
  }

  update(time: number, dt: number) {
    super.update(dt)

    this.text?.setText(this.debug())
  }

  debug(): string {
    return this.entityManager
      .getAllEntities()
      .map((entity) => {
        const tag = this.entityManager.getTagByEntity(entity)
        let msg = `--${tag || entity}--\n`
        msg += this.debugEntity(entity)
        return msg
      })
      .join('\n\n---------\n\n')
  }

  debugEntity(entity: Entity): string {
    return this.entityManager
      .getComponents(entity)
      .map((component: Component) => {
        let msg = `${component.toString()}: `
        if (component instanceof Renderer) {
          msg += `\nsprite.x: ${component.sprite.x} sprite.y: ${component.sprite.y}\n`
          return msg
        }

        msg += Object.entries(component)
          .map(([key, value]): string => {
            return ` ${key}: ${value}`
          })
          .join('')

        return msg
      })
      .join('\n')
  }
}
