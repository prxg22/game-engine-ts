import { Entity, EntityManager } from '../../../Core'
import Engine from '../Components/Engine'
import Fuel from '../Components/Fuel'
import Motion from '../Components/GravitySensitive'
import GravitySensitive from '../Components/Motion'
import Input from '../Components/Input'
import Renderable from '../Components/Renderable'
import SpatialState from '../Components/SpatialState'

export const createPlayer = (
  entityManager: EntityManager,
  factory: Phaser.GameObjects.GameObjectFactory,
  input: Phaser.Input.InputPlugin
): Entity => {
  const player = entityManager.createEntity()
  const [x, y] = [400, 300]
  const sprite = factory.sprite(x, y, 'ship')
  const keys = [
    input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
  ]

  entityManager.addComponent(new SpatialState(x, y, 0, 0), player)
  entityManager.addComponent(new Engine(0.000001), player)
  entityManager.addComponent(new Fuel(20000), player)
  entityManager.addComponent(new Renderable(sprite), player)
  entityManager.addComponent(new GravitySensitive(), player)
  entityManager.addComponent(new Motion(), player)
  entityManager.addComponent(new Input(keys), player)

  return player
}
