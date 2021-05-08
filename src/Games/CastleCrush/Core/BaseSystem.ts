import { System } from '../../../Core'
import { CLOCK } from '../constants'
import BaseEntityManager from './BaseEntityManager'
import Factory from '../Factory'

export default abstract class BaseSystem extends System {
  dtClock: number = 0
  factory?: Factory

  constructor(
    public entityManager: BaseEntityManager,
    public gameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    public inputPlugin: Phaser.Input.InputPlugin,
  ) {
    super(entityManager, gameObjectFactory, inputPlugin)
  }

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  clock(dt: number) {}

  update(dt: number) {}
}
