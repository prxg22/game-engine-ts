import Phaser from "phaser"
import EntityManager from "./EntityManager"

abstract class System {
  constructor(
    public entityManager: EntityManager,
    public scene: Phaser.Scene
  ) {}

  abstract update(dt: number): void
  render(dt: number): void {}
}
export default System
