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
  P1_CREATURE_COLOR_ATTACKING,
  P2_CREATURE_COLOR_ATTACKING,
  P1_CREATURE_COLOR_MOVING,
  P2_CREATURE_COLOR_MOVING,
  P1_TAG,
  P2_TAG,
} from '../constants'

import BaseSystem from '../Core/BaseSystem'

export default class LaneMovementSystem extends BaseSystem {
  moveCreatures(owner: Entity) {
    const creatures = this.entityManager.getPlayerCreatures(owner)

    creatures.forEach(creature => {
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

      lanePosition.position += creatureAttributes.speed

      lanePosition.position = Math.max(
        0,
        Math.min(lanePosition.position, LANE_SIZE),
      )
    })
  }

  clock() {
    const player1 = this.entityManager.player1 || -1
    const player2 = this.entityManager.player2 || -1
    this.moveCreatures(player1)
    this.moveCreatures(player2)
  }

  positionText: Phaser.GameObjects.Text[] = []

  render(dt: number) {
    const player1: Entity = this.entityManager.player1 || -1
    const player2: Entity = this.entityManager.player2 || -1

    ;[player1, player2].forEach(player => {
      const isPlayer1 = this.entityManager.isPlayer1(player)
      const creatureCollection = this.entityManager.getComponentOfClass(
        CreatureCollection,
        player,
      ) as CreatureCollection

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

        if (creatureAttributes.status === CREATURE_STATUS.ATACKING) {
          sprite.setFillStyle(
            isPlayer1
              ? P1_CREATURE_COLOR_ATTACKING
              : P2_CREATURE_COLOR_ATTACKING,
          )

          return
        }

        sprite.setFillStyle(
          isPlayer1 ? P1_CREATURE_COLOR_MOVING : P2_CREATURE_COLOR_MOVING,
        )

        const [displayX = 0, displayY] =
          LaneMovementSystem.calculateDisplayPosition(
            lanePosition,
            isPlayer1,
          ) || []

        const dx =
          (dt / CLOCK) * creatureAttributes.speed * (isPlayer1 ? 1 : -1)

        if (
          !displayX ||
          !displayY ||
          (isPlayer1 && sprite.x >= displayX) ||
          (!isPlayer1 && sprite.x <= displayX)
        )
          return

        const operation = isPlayer1 ? 'min' : 'max'

        const x = Math.max(0, Math[operation](sprite.x + dx, displayX))

        const msg = `${creature}\nhp:${health.current}\nx:${
          isPlayer1 ? lanePosition.position : LANE_SIZE - lanePosition.position
        }`

        this.positionText[creature] = this.positionText[creature]
          ? this.positionText[creature].setPosition(x, displayY).setText(msg)
          : this.gameObjectFactory.text(x, displayY, msg, {
              fontSize: '11px',
            })

        sprite.setPosition(x, displayY)
      })
    })
  }

  static calculateDisplayPosition(
    lanePosition: LanePosition,
    isPlayer1: boolean,
  ): [number, number] | undefined {
    const [baseX, baseY] = LANE_DISPLAY_ORIGIN
    const [baseWidth, baseHeight] = LANE_DISPLAY_SIZE

    const position = isPlayer1
      ? lanePosition.position
      : LANE_SIZE - lanePosition.position
    const displayX = baseX + (position * baseWidth) / LANE_SIZE - CREATURE_SIZE
    const displayY =
      baseY +
      (baseHeight / 2 - CREATURE_SIZE / 2) -
      (baseHeight + LANE_MARGIN_SIZE) * lanePosition.lane * 2

    return [displayX, displayY]
  }
}
