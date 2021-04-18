import Phaser from 'phaser'
import EntityManager from './EntityManager'

abstract class System {
  constructor(
    public entityManager: EntityManager,
    public gameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    public inputPlugin: Phaser.Input.InputPlugin
  ) {}

  abstract update(dt?: number): void
  create(): void {}
  render(dt?: number): void {}
}

export default System
