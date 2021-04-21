import { GameObjects } from 'phaser'
import { Entity, EntityManager } from '../../../Core'
import CreatureCreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
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
} from '../constants'
import MainScene from '../Scenes/MainScene'
import BaseSystem from './BaseSystem'

export default class LaneMovementSystem extends BaseSystem {
  constructor(
    entityManager: EntityManager,
    gameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    inputPlugin: Phaser.Input.InputPlugin,
  ) {
    super(entityManager, gameObjectFactory, inputPlugin)
  }

  moveCreatures(player: Entity, isOpoonent: boolean = false) {
    const playerCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player,
    ) as CreatureCollection

    playerCreatures.entities.forEach(creature => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureCreatureAttributes,
        creature,
      ) as CreatureCreatureAttributes

      if (creatureAttributes.status === CREATURE_STATUS.ATACKING) return
      creatureAttributes.status = CREATURE_STATUS.MOVING

      const lanePostion = this.entityManager.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      if (creatureAttributes.status === CREATURE_STATUS.MOVING && !isOpoonent)
        lanePostion.position += creatureAttributes.speed
      else if (creatureAttributes.status === CREATURE_STATUS.MOVING)
        lanePostion.position -= creatureAttributes.speed

      lanePostion.position = Math.max(
        0,
        Math.min(lanePostion.position, LANE_SIZE),
      )
    })
  }

  update(dt: number) {
    if (this.clock) return

    const player = this.entityManager.getEntityByTag('player') || -1
    const opponent = this.entityManager.getEntityByTag('opponent') || -1
    this.moveCreatures(player)
    this.moveCreatures(opponent, true)
  }

  render(dt: number) {
    const player: Entity = this.entityManager.getEntityByTag('player') || -1
    const opponent: Entity = this.entityManager.getEntityByTag('opponent') || -1

    ;[player, opponent].forEach(entity => {
      const creatureCollection = this.entityManager.getComponentOfClass(
        CreatureCollection,
        entity,
      ) as CreatureCollection

      // MainScene.instance().debugComponent(creatureCollection)
      creatureCollection.entities.forEach(creature => {
        const lanePosition = this.entityManager.getComponentOfClass(
          LanePosition,
          creature,
        ) as LanePosition
        const renderer = this.entityManager.getComponentOfClass(
          Renderer,
          creature,
        ) as Renderer<GameObjects.Shape>

        if (!lanePosition) return

        const [displayX, displayY] =
          LaneMovementSystem.calculateDisplayPosition(lanePosition) || []

        if (!displayX || !displayY) return

        renderer.sprite.setPosition(displayX, displayY)
      })
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
    // MainScene.instance().debug(
    //   `
    //   LaneMovementySystem.calculateDisplayPosition:
    //   lane: ${lanePosition.lane}  position: ${lanePosition.position}
    //   baseX: ${baseX} baseY: ${baseY} baseWidth: ${baseWidth}
    //   display: ${[displayX, displayY].join('-\t')}
    //   `,
    // )

    return [displayX, displayY]
  }
}
