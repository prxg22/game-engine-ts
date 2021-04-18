import Phaser, { GameObjects } from 'phaser'
import { Entity, EntityManager } from '../../../Core'
import Renderable from '../Components/Renderable'
import EntityCollection from '../Components/EntityCollection'
import Input from '../Components/Input'
import Spatial from '../Components/Spatial'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRID_SIZE,
  RED,
  GREEN,
  BLUE,
  WHITE,
  KEY_UP,
  KEY_DOWN,
  KEY_LEFT,
  KEY_RIGHT,
  MAX_X,
  MAX_Y
} from '../constants'
import Collidebale from '../Components/Collideable'

let instance: Factory
export default class Factory {
  constructor(
    public entityManager?: EntityManager,
    public factory?: Phaser.GameObjects.GameObjectFactory,
    public input?: Phaser.Input.InputPlugin
  ) {
    if (instance) return instance

    instance = this
  }

  snake(): Entity {
    if (!this.input || !this.entityManager || !this.factory)
      throw Error('Factory must have entityManager, input and factory')

    const position = {
      x: Phaser.Math.Between(1, MAX_X - 1),
      y: Phaser.Math.Between(1, MAX_Y - 1)
    }
    const snake = this.entityManager.createEntity('snake')

    const keys = [
      this.input?.keyboard.addKey(KEY_UP),
      this.input?.keyboard.addKey(KEY_DOWN),
      this.input?.keyboard.addKey(KEY_LEFT),
      this.input?.keyboard.addKey(KEY_RIGHT)
    ]

    this.entityManager?.addComponent(new Input(keys), snake)
    this.entityManager?.addComponent(new EntityCollection(), snake)
    this.entityManager?.addComponent(new Collidebale(), snake)
    this.entityManager?.addComponent(
      new Spatial(position.x, position.y, 1, 0),
      snake
    )
    this.entityManager?.addComponent(
      new Renderable<Phaser.GameObjects.Rectangle>(
        this.factory?.rectangle(
          position.x * GRID_SIZE,
          position.y * GRID_SIZE,
          GRID_SIZE,
          GRID_SIZE,
          GREEN
        )
      ),
      snake
    )

    return snake
  }

  apple(): Entity {
    if (!this.input || !this.entityManager || !this.factory)
      throw Error('Factory must have entityManager, input and factory')

    const position = {
      x: Phaser.Math.Between(1, MAX_X - 1),
      y: Phaser.Math.Between(1, MAX_Y - 1)
    }
    const apple = this.entityManager?.createEntity('apple')
    this.entityManager?.addComponent(new Collidebale(), apple)

    this.entityManager?.addComponent(
      new Spatial(position.x, position.y, 0, 0),
      apple
    )

    this.entityManager.addComponent(
      new Renderable<GameObjects.Shape>(
        this.factory.rectangle(
          position.x * GRID_SIZE,
          position.y * GRID_SIZE,
          GRID_SIZE,
          GRID_SIZE,
          RED
        )
      ),
      apple
    )

    return apple
  }

  frame() {
    const frame = this.factory?.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH - GRID_SIZE,
      CANVAS_HEIGHT - GRID_SIZE
    )
    frame?.setStrokeStyle(GRID_SIZE, BLUE, 1)
  }

  static get factory(): Factory {
    return instance
  }
}
