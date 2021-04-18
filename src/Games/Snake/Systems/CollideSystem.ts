import { GameObjects } from 'phaser'
import { Entity, System } from '../../../Core'
import Collidebale from '../Components/Collideable'
import Spatial from '../Components/Spatial'
import { MAX_X, MAX_Y, TICK } from '../constants'

export default class CollideSystem extends System {
  time: number = 0
  findEntitiesOnSamePosition(sourceEntity: Entity): Entity[] {
    const sourceSpatial = this.entityManager.getComponentOfClass(
      Spatial,
      sourceEntity
    ) as Spatial
    const spatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Collidebale, Spatial]
    )

    return spatialEntities.reduce(
      (entitiesOnPosition: Entity[], entity: Entity): Entity[] => {
        if (entity === sourceEntity) return entitiesOnPosition

        const spatial = this.entityManager.getComponentOfClass(
          Spatial,
          entity
        ) as Spatial

        const isCollideable = this.entityManager.getComponentOfClass(
          Collidebale,
          entity
        )

        if (
          spatial.x === sourceSpatial.x &&
          spatial.y === sourceSpatial.y &&
          isCollideable
        )
          return [...entitiesOnPosition, entity]
        return entitiesOnPosition
      },
      []
    )
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0
    const snake = this.entityManager.getEntityByTag('snake')
    const apple = this.entityManager.getEntityByTag('apple')
    if (!snake || !apple) return

    const colliders = this.findEntitiesOnSamePosition(snake)
    if (!colliders.length) return

    const collidedWithApple = colliders.some((e) => e === apple)
    if (collidedWithApple) {
      const appleSpatial = this.entityManager.getComponentOfClass(
        Spatial,
        apple
      ) as Spatial

      appleSpatial.x = Phaser.Math.Between(0, MAX_X)
      appleSpatial.y = Phaser.Math.Between(0, MAX_Y)
    }
  }
}
