import Phaser, { GameObjects } from 'phaser'
import { Entity, System } from '../../../Core'
import MouseInput from '../Components/MouseInput'
import Renderer from '../Components/Renderer'

export default class MouseInputSystem extends System {
  update() {}

  create() {
    const mouseInputAndRendererEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [MouseInput, Renderer],
    )

    mouseInputAndRendererEntities.forEach(entity => {
      const renderer = this.entityManager.getComponentOfClass(
        Renderer,
        entity,
      ) as Renderer<GameObjects.Shape>
      const mouse = this.entityManager.getComponentOfClass(
        MouseInput,
        entity,
      ) as MouseInput

      MouseInputSystem.bindMouseClickEvent(renderer, mouse)
    })
  }

  static bindMouseClickEvent(
    renderer: Renderer<GameObjects.Shape>,
    mouse: MouseInput,
  ) {
    renderer.sprite.setInteractive()
    renderer.sprite.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        mouse.click(
          pointer.x - renderer.sprite.x,
          pointer.y - renderer.sprite.y,
        )
      },
    )
  }

  clearMouseInput(entity: Entity) {
    const mouse = this.entityManager.getComponentOfClass(
      MouseInput,
      entity,
    ) as MouseInput

    mouse.click(-1, -1)
  }

  render() {
    const mouseInputEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [MouseInput],
    )
    // clear entities
    mouseInputEntities.forEach(entity => {
      this.clearMouseInput(entity)
    })
  }
}
