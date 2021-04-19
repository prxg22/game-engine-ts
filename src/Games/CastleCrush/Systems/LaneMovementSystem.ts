import { System } from '../../../Core'
import CreatureCreatureAttributes, {
  CREATURE_STATUS
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import LanePosition from '../Components/LanePosition'
import { MAX_LANE_POSITION, TICK } from '../constants'

export default class LaneMovementSystem extends System {
  private time: number = 0

  movePlayerCreatures() {
    const player = this.entityManager.getEntityByTag('player') || -1
    const playerCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player
    ) as CreatureCollection

    playerCreatures.entities.forEach((creature) => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureCreatureAttributes,
        creature
      ) as CreatureCreatureAttributes

      if (creatureAttributes.status === CREATURE_STATUS.ATACKING) return
      creatureAttributes.status = CREATURE_STATUS.MOVING

      const lanePostion = this.entityManager.getComponentOfClass(
        LanePosition,
        creature
      ) as LanePosition

      if (creatureAttributes.status === CREATURE_STATUS.MOVING)
        lanePostion.position += creatureAttributes.speed
      lanePostion.position = Math.max(
        0,
        Math.min(lanePostion.position, MAX_LANE_POSITION)
      )
    })
  }

  moveOpponentCreatures() {
    const opponent = this.entityManager.getEntityByTag('opponent') || -1
    const opponentCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      opponent
    ) as CreatureCollection

    opponentCreatures.entities.forEach((creature) => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureCreatureAttributes,
        creature
      ) as CreatureCreatureAttributes

      if (creatureAttributes.status === CREATURE_STATUS.ATACKING) return
      creatureAttributes.status = CREATURE_STATUS.MOVING

      const lanePostion = this.entityManager.getComponentOfClass(
        LanePosition,
        creature
      ) as LanePosition

      if (creatureAttributes.status === CREATURE_STATUS.MOVING)
        lanePostion.position -= creatureAttributes.speed
      lanePostion.position = Math.max(
        0,
        Math.min(lanePostion.position, MAX_LANE_POSITION)
      )
    })
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0

    this.movePlayerCreatures()
    this.moveOpponentCreatures()
    // const player = this.entityManager.getEntityByTag('player') || -1
    // const playerCreatures = this.entityManager.getComponentOfClass(
    //   CreatureCollection,
    //   player
    // ) as CreatureCollection

    // const opponent = this.entityManager.getEntityByTag('opponent') || -1
    // const opponentCreatures = this.entityManager.getComponentOfClass(
    //   CreatureCollection,
    //   opponent
    // ) as CreatureCollection

    // playerCreatures.entities.forEach((creature) => {
    //   const creatureAttributes = this.entityManager.getComponentOfClass(
    //     CreatureCreatureAttributes,
    //     creature
    //   ) as CreatureCreatureAttributes

    //   if (creatureAttributes.status === CREATURE_STATUS.ATACKING) return
    //   creatureAttributes.status = CREATURE_STATUS.MOVING

    //   const lanePostion = this.entityManager.getComponentOfClass(
    //     LanePosition,
    //     creature
    //   ) as LanePosition

    //   if (creatureAttributes.status === CREATURE_STATUS.MOVING)
    //     lanePostion.position += creatureAttributes.speed
    //   lanePostion.position = Math.max(
    //     0,
    //     Math.min(lanePostion.position, MAX_LANE_POSITION)
    //   )
    // })
  }
}
