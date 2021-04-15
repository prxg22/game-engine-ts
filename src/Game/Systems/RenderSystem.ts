import { System } from '../../Core'
import { Vector2D } from '../../Utils/Vector2D'
import RenderComponent from '../Components/RenderComponent'
import RigidBodyComponent from '../Components/RigidBodyComponent'

class RenderSystem extends System {
  private cellSize: Vector2D = [16, 16]

  update() {}

  render() {
    const entities = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      RenderComponent,
    )

    entities.forEach(entity => {
      const render = this.entityManager.getComponentOfClass<RenderComponent>(
        RenderComponent,
        entity,
      )
      const rigidBody = this.entityManager.getComponentOfClass<RigidBodyComponent>(
        RigidBodyComponent,
        entity,
      )

      if (!render || !rigidBody || !rigidBody.position) return

      const [cellW, cellH] = this.cellSize
      render.node.setPosition(rigidBody.x * cellW, rigidBody.y * cellH)
    })
  }
}

export default RenderSystem
