import Phaser from 'phaser'
import EntityManager from './EntityManager'

abstract class System {
  constructor(public entityManager: EntityManager) {}

  abstract update(dt: number): void
  create(): void {}
  preload(): void {}
  render(dt: number): void {}
}

export default System
