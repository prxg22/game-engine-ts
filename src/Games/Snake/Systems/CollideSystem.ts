import { GameObjects } from 'phaser'
import { Entity, EntityManager, System } from '../../../Core'
import Alive from '../Components/Alive'
import Collidable from '../Components/Collidable'
import Spatial from '../Components/Spatial'
import Factory from '../Factory'
import { MAX_X, MAX_Y, TICK } from '../constants'
import EntityCollection from '../Components/EntityCollection'
import TickSystem from './TickSystem'

export default class CollideSystem extends System {
  entityFactory: Factory = new Factory()
  time: number = 0

  findEntitiesOnSamePosition(sourceEntity: Entity): Entity[] {
    const sourceSpatial = this.entityManager.getComponentOfClass(
      Spatial,
      sourceEntity
    ) as Spatial
    const spatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Collidable, Spatial]
    )

    return spatialEntities.reduce(
      (entitiesOnPosition: Entity[], entity: Entity): Entity[] => {
        if (entity === sourceEntity) return entitiesOnPosition

        const spatial = this.entityManager.getComponentOfClass(
          Spatial,
          entity
        ) as Spatial

        const isCollidable = this.entityManager.getComponentOfClass(
          Collidable,
          entity
        )

        if (
          spatial.x === sourceSpatial.x + sourceSpatial.dx &&
          spatial.y === sourceSpatial.y + sourceSpatial.dy &&
          isCollidable
        )
          return [...entitiesOnPosition, entity]
        return entitiesOnPosition
      },
      []
    )
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TickSystem.tick) return
    this.time = 0

    const snake = this.entityManager.getEntityByTag('snake')
    const apple = this.entityManager.getEntityByTag('apple')
    if (!snake || !apple) return

    const colliders = this.findEntitiesOnSamePosition(snake)
    const snakeSpatial = this.entityManager.getComponentOfClass(
      Spatial,
      snake
    ) as Spatial
    const collidedWithSomething = colliders.length
    const collidedWithApple =
      collidedWithSomething && colliders.some((e) => e === apple)

    if (collidedWithApple) {
      const appleSpatial = this.entityManager.getComponentOfClass(
        Spatial,
        apple
      ) as Spatial

      const bodyParts = this.entityManager.getComponentOfClass(
        EntityCollection,
        snake
      ) as EntityCollection

      appleSpatial.x = Phaser.Math.Between(1, MAX_X - 1)
      appleSpatial.y = Phaser.Math.Between(1, MAX_Y - 1)

      const bodyPart = this.entityFactory?.bodyPart(
        snakeSpatial.x,
        snakeSpatial.y
      )

      if (bodyPart) bodyParts.entities.push(bodyPart)
      return
    }

    if (
      snakeSpatial.x + snakeSpatial.dx <= 0 ||
      snakeSpatial.y + snakeSpatial.dy <= 0 ||
      snakeSpatial.x + snakeSpatial.dx >= MAX_X ||
      snakeSpatial.y + snakeSpatial.dy >= MAX_Y ||
      collidedWithSomething
    ) {
      const snakeAlive = this.entityManager.getComponentOfClass(
        Alive,
        snake
      ) as Alive

      snakeAlive.isAlive = false

      const bodyParts = this.entityManager.getComponentOfClass(
        EntityCollection,
        snake
      ) as EntityCollection

      bodyParts.entities.forEach((bodyPart) => {
        const alive = this.entityManager.getComponentOfClass(
          Alive,
          bodyPart
        ) as Alive

        if (alive) alive.isAlive = false
      })
    }
  }
}
