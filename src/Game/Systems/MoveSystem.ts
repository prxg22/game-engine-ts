import { System } from '../../Core'
import MoveComponent, {
  DIRECTIONS,
  MOVEMENT_STATUS,
} from '../Components/MoveComponent'
import RigidBodyComponent from '../Components/RigidBodyComponent'

class MoveSystem extends System {
  update() {
    const entitites = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      MoveComponent,
    )

    entitites.forEach(entity => {
      const rigidBody = this.entityManager.getComponentOfClass<RigidBodyComponent>(
        RigidBodyComponent,
        entity,
      )
      const move = this.entityManager.getComponentOfClass<MoveComponent>(
        MoveComponent,
        entity,
      )

      if (!rigidBody || !move) return

      if (move?.status !== MOVEMENT_STATUS.MOVING && move?.direction !== [0, 0])
        return

      const [h, v] = move.direction
      rigidBody.x += h * move.speed
      rigidBody.y += v * move.speed
      console.log({ direction: move.direction, position: rigidBody.position })
    })
  }
}

export default MoveSystem
