import { System } from '../../../Core'
import MouseInput from '../Components/MouseInput'

export default class MouseInputSystem extends System {
  getClickPosition(): number[] | undefined {
    if (!this.inputPlugin.mousePointer.leftButtonDown()) return
    return [this.inputPlugin.mousePointer.x, this.inputPlugin.mousePointer.y]
  }

  updateEntityInput(entity: number, mouseX: number, mouseY: number) {
    const input = this.entityManager.getComponentOfClass(
      MouseInput,
      entity,
    ) as MouseInput

    input.click(mouseX, mouseY)
  }

  update(dt: number) {
    const mouseInputEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [MouseInput],
    )

    const [mouseX, mouseY] = this.getClickPosition() || []
    mouseInputEntities.forEach(entity => {
      this.updateEntityInput(entity, mouseX, mouseY)
    })
  }
}
