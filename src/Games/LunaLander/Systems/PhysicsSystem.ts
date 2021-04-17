import { System } from '../../../Core'
import Motion from '../Components/GravitySensitive'
import GravitySensitive from '../Components/Motion'
import SpatialState from '../Components/SpatialState'

const ACCELERATION = 0.00000001
const DOWN = Math.cos(Math.PI)

class PhysicsSystem extends System {
  update(delta: number) {
    const spatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClass<GravitySensitive>(
      GravitySensitive
    )

    spatialEntities.forEach((entity) => {
      const spatial = this.entityManager.getComponentOfClass<SpatialState>(
        SpatialState,
        entity
      )

      // if (spatial) spatial.dy += ACCELERATION * delta
    })

    const movingEntities = this.entityManager.getAllEntitiesPosessingComponentOfClass<Motion>(
      Motion
    )

    movingEntities.forEach((entity) => {
      const spatial = this.entityManager.getComponentOfClass<SpatialState>(
        SpatialState,
        entity
      )

      if (!spatial) return

      let amount = 0.0001 * delta * spatial?.dx
      spatial.x += amount
      if (spatial.x >= 800) spatial.x = 800

      amount = 0.0001 * delta * spatial.dy
      spatial.y += amount * DOWN
      if (spatial.y >= 600) spatial.x = 600
    })
  }
}

export default PhysicsSystem
