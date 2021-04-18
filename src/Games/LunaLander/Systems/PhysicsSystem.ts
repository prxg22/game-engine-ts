import { System } from '../../../Core'
import Motion from '../Components/GravitySensitive'
import GravitySensitive from '../Components/Motion'
import SpatialState from '../Components/SpatialState'

const ACCELERATION = 0.005
const DOWN = Math.cos(Math.PI)

class PhysicsSystem extends System {
  update(delta: number) {
    const spatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [GravitySensitive]
    )

    spatialEntities.forEach((entity) => {
      const spatial = this.entityManager.getComponentOfClass<SpatialState>(
        SpatialState,
        entity
      )

      if (spatial) spatial.dy -= ACCELERATION * delta
    })

    const movingEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Motion]
    )

    movingEntities.forEach((entity) => {
      const spatial = this.entityManager.getComponentOfClass<SpatialState>(
        SpatialState,
        entity
      )

      if (!spatial) return

      let amount = 0.01 * delta * spatial?.dx
      spatial.x += amount
      spatial.x = Math.max(Math.min(800, spatial.x), 0)

      amount = 0.01 * delta * spatial.dy
      spatial.y += amount * DOWN
      spatial.y = Math.max(Math.min(600, spatial.y), 0)
    })
  }
}

export default PhysicsSystem
