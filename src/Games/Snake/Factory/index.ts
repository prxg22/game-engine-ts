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
  FRAME_FRAME_UP,
  FRAME_FRAME_DOWN,
  FRAME_FRAME_LEFT,
  FRAME_FRAME_RIGHT,
  FRAME_COLOR,
  KEY_UP,
  KEY_DOWN,
  KEY_LEFT,
  KEY_RIGHT,
  MAX_X,
  MAX_Y,
  SNAKE_FRAME_BODY,
  SNAKE_FRAME_RIGHT,
  APPLE_FRAME
} from '../constants'
import Collidable from '../Components/Collidable'
import Alive from '../Components/Alive'

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
    const bodyPart = this.bodyPart(position.x - 1, position.y) as Entity

    const keys = [
      this.input?.keyboard.addKey(KEY_UP),
      this.input?.keyboard.addKey(KEY_DOWN),
      this.input?.keyboard.addKey(KEY_LEFT),
      this.input?.keyboard.addKey(KEY_RIGHT)
    ]

    this.entityManager?.addComponent(new Input(keys), snake)
    this.entityManager?.addComponent(new EntityCollection([bodyPart]), snake)
    this.entityManager?.addComponent(new Collidable(), snake)
    this.entityManager?.addComponent(
      new Spatial(position.x, position.y, 0, 0),
      snake
    )

    this.entityManager?.addComponent(
      new Renderable(
        this.factory?.sprite(
          position.x * GRID_SIZE,
          position.y * GRID_SIZE,
          'snake',
          SNAKE_FRAME_RIGHT
        )
      ),
      snake
    )

    this.entityManager.addComponent(new Alive(), snake)
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
    this.entityManager?.addComponent(new Collidable(), apple)

    this.entityManager?.addComponent(
      new Spatial(position.x, position.y, 0, 0),
      apple
    )

    this.entityManager.addComponent(
      new Renderable(
        this.factory.sprite(position.x, position.y, 'snake', APPLE_FRAME)
      ),
      apple
    )

    return apple
  }

  bodyPart(x: number, y: number): Entity | undefined {
    if (!this.input || !this.entityManager || !this.factory)
      throw Error('Factory must have entityManager, input and factory')
    const bodyPart = this.entityManager.createEntity() as Entity

    this.entityManager.addComponent(new Alive(), bodyPart)
    this.entityManager.addComponent(new Collidable(), bodyPart)
    this.entityManager?.addComponent(new Spatial(x, y, 0, 0), bodyPart)
    this.entityManager?.addComponent(
      new Renderable(this.factory.sprite(x, y, 'snake', SNAKE_FRAME_BODY)),
      bodyPart
    )

    return bodyPart
  }

  frame() {
    const frame = this.factory?.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH - GRID_SIZE,
      CANVAS_HEIGHT - GRID_SIZE
    )
    frame?.setStrokeStyle(GRID_SIZE, FRAME_COLOR, 1)

    for (let i = 0; i <= MAX_X; i++) {
      this.factory
        ?.sprite(i * GRID_SIZE, 0, 'snake', FRAME_FRAME_UP)
        .setDisplayOrigin(0, 0)
      this.factory
        ?.sprite(i * GRID_SIZE, MAX_Y * GRID_SIZE, 'snake', FRAME_FRAME_DOWN)
        .setDisplayOrigin(0, 0)
    }

    for (let i = 0; i <= MAX_Y; i++) {
      this.factory
        ?.sprite(0, i * GRID_SIZE, 'snake', FRAME_FRAME_LEFT)
        .setDisplayOrigin(0, 0)
      this.factory
        ?.sprite(MAX_X * GRID_SIZE, i * GRID_SIZE, 'snake', FRAME_FRAME_RIGHT)
        .setDisplayOrigin(0, 0)
    }
  }
}
