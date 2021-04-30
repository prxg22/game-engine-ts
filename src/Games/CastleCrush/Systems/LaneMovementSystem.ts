import { GameObjects } from 'phaser'
import { Entity, EntityManager } from '../../../Core'
import CreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import Health from '../Components/Health'
import LanePosition from '../Components/LanePosition'
import Renderer from '../Components/Renderer'
import {
  LANE_SIZE,
  CLOCK,
  LANES,
  LANE_DISPLAY_ORIGIN,
  LANE_DISPLAY_SIZE,
  LANE_MARGIN_SIZE,
  CREATURE_SIZE,
  CREATURE_COLOR_MOVING,
  CREATURE_COLOR_ATTACKING,
  P1_CREATURE_COLOR_ATTACKING,
  P2_CREATURE_COLOR_ATTACKING,
  P1_CREATURE_COLOR_MOVING,
  P2_CREATURE_COLOR_MOVING,
} from '../constants'
import MainScene from '../Scenes/MainScene'
import BaseSystem from './BaseSystem'

export default class LaneMovementSystem extends BaseSystem {
  moveCreatures(owner: Entity) {
    const isPlayer = owner === this.entityManager.getEntityByTag('player')
    const playerCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      owner,
    ) as CreatureCollection

    playerCreatures.entities.forEach(creature => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        creature,
      ) as CreatureAttributes

      if (creatureAttributes.status === CREATURE_STATUS.ATACKING) return
      creatureAttributes.status = CREATURE_STATUS.MOVING

      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      if (creatureAttributes.status === CREATURE_STATUS.MOVING && isPlayer)
        lanePosition.position += creatureAttributes.speed
      else if (creatureAttributes.status === CREATURE_STATUS.MOVING)
        lanePosition.position -= creatureAttributes.speed

      lanePosition.position = Math.max(
        0,
        Math.min(lanePosition.position, LANE_SIZE),
      )
    })
  }

  clock() {
    const player = this.entityManager.getEntityByTag('player') || -1
    const opponent = this.entityManager.getEntityByTag('opponent') || -1
    this.moveCreatures(player)
    this.moveCreatures(opponent)
  }

  render(dt: number) {
    const player: Entity = this.entityManager.getEntityByTag('player') || -1
    const opponent: Entity = this.entityManager.getEntityByTag('opponent') || -1

    ;[player, opponent].forEach(entity => {
      const isPlayer = entity === this.entityManager.getEntityByTag('player')
      const creatureCollection = this.entityManager.getComponentOfClass(
        CreatureCollection,
        entity,
      ) as CreatureCollection

      let msg = `
        LaneMovementySystem.render:
        creatureCollection: ${creatureCollection.entities}
        `
      creatureCollection.entities.forEach(creature => {
        const lanePosition = this.entityManager.getComponentOfClass(
          LanePosition,
          creature,
        ) as LanePosition

        const creatureAttributes = this.entityManager.getComponentOfClass(
          CreatureAttributes,
          creature,
        ) as CreatureAttributes

        const { sprite } = this.entityManager.getComponentOfClass(
          Renderer,
          creature,
        ) as Renderer<GameObjects.Shape>

        const health = this.entityManager.getComponentOfClass(
          Health,
          creature,
        ) as Health

        if (!lanePosition) return
        msg += `
            -- creature ${creature} --
            name: ${creatureAttributes.name} - hp: ${health.current}/${health.max} - status: ${creatureAttributes.status}
            lane: ${lanePosition.lane} - position: ${lanePosition.position}
            sprite: {x: ${sprite.x}, y: ${sprite.y}}

          `
        if (creatureAttributes.status === CREATURE_STATUS.ATACKING) {
          sprite.setFillStyle(
            isPlayer
              ? P1_CREATURE_COLOR_ATTACKING
              : P2_CREATURE_COLOR_ATTACKING,
          )

          return
        }

        sprite.setFillStyle(
          isPlayer ? P1_CREATURE_COLOR_MOVING : P2_CREATURE_COLOR_MOVING,
        )

        const [displayX = 0, displayY] =
          LaneMovementSystem.calculateDisplayPosition(lanePosition) || []

        const dx = (dt / CLOCK) * creatureAttributes.speed * (isPlayer ? 1 : -1)

        if (
          !displayX ||
          !displayY ||
          (isPlayer && sprite.x >= displayX) ||
          (!isPlayer && sprite.x <= displayX)
        )
          return

        const operation = isPlayer ? 'min' : 'max'

        sprite.setPosition(
          Math.max(0, Math[operation](sprite.x + dx, displayX)),
          displayY,
        )
      })

      // MainScene.instance.debug(msg)
    })
  }

  static calculateDisplayPosition(
    lanePosition: LanePosition,
  ): [number, number] | undefined {
    const [baseX, baseY] = LANE_DISPLAY_ORIGIN
    const [baseWidth, baseHeight] = LANE_DISPLAY_SIZE

    const displayX = baseX + (lanePosition.position * baseWidth) / LANE_SIZE
    const displayY =
      baseY +
      (baseHeight / 2 - CREATURE_SIZE / 2) -
      (baseHeight + LANE_MARGIN_SIZE) * lanePosition.lane * 2

    return [displayX, displayY]
  }
}
