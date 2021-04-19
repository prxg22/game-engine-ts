import { Entity, System } from '../../../Core'
import CreatureCreatureAttributes, {
  CREATURE_STATUS
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import LanePosition from '../Components/LanePosition'
import { MAX_LANE_POSITION, TICK, LANES } from '../constants'

export default class LaneMovementSystem extends System {
  private time: number = 0

  moveCreatures(player: Entity, isOpoonent: boolean = false) {
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

      if (creatureAttributes.status === CREATURE_STATUS.MOVING && !isOpoonent)
        lanePostion.position += creatureAttributes.speed
      else if (creatureAttributes.status === CREATURE_STATUS.MOVING)
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

    const player = this.entityManager.getEntityByTag('player') || -1
    const opponent = this.entityManager.getEntityByTag('opponent') || -1
    this.moveCreatures(player)
    this.moveCreatures(opponent, true)
  }
}