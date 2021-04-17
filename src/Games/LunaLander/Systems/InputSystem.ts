import { EntityManager, System } from '../../../Core'
import Engine from '../Components/Engine'
import Input from '../Components/Input'
import Renderable from '../Components/Renderable'

class InputSystem extends System {
  P1_KEY_THRUST = Phaser.Input.Keyboard.KeyCodes.S
  P1_KEY_ROTL = Phaser.Input.Keyboard.KeyCodes.A
  P1_KEY_ROTR = Phaser.Input.Keyboard.KeyCodes.D

  constructor(
    entityManager: EntityManager,
    factory: Phaser.GameObjects.GameObjectFactory,
    inputPlugin: Phaser.Input.InputPlugin
  ) {
    super(entityManager, factory, inputPlugin)
  }

  findKey(code: number): Phaser.Input.Keyboard.Key | undefined {
    return this.inputPlugin.keyboard.keys[code]
  }

  update(delta: number) {
    const inputEntites = this.entityManager.getAllEntitiesPosessingComponentOfClass<Input>(
      Input
    )

    inputEntites.forEach((entity) => {
      const input = this.entityManager.getComponentOfClass<Input>(Input, entity)

      const p1ThrustKey = this.findKey(this.P1_KEY_THRUST)
      if (p1ThrustKey?.isDown && input?.responsiveKeys.includes(p1ThrustKey)) {
        const engine = this.entityManager.getComponentOfClass<Engine>(
          Engine,
          entity
        )
        if (engine) engine.on = true
      }

      const p1RotateLeftKey = this.findKey(this.P1_KEY_ROTL)
      if (
        p1RotateLeftKey?.isDown &&
        input?.responsiveKeys.includes(p1RotateLeftKey)
      ) {
        const renderable = this.entityManager.getComponentOfClass<
          Renderable<Phaser.GameObjects.Sprite>
        >(Renderable, entity)
        renderable?.rotate(delta * 0.00001)
      }

      const p1RotateRightKey = this.findKey(this.P1_KEY_ROTR)
      if (
        p1RotateRightKey?.isDown &&
        input?.responsiveKeys.includes(p1RotateRightKey)
      ) {
        const renderable = this.entityManager.getComponentOfClass<
          Renderable<Phaser.GameObjects.Sprite>
        >(Renderable, entity)
        renderable?.rotate(delta * -0.00001)
      }
    })
  }
}

export default InputSystem
