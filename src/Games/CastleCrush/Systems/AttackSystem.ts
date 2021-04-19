import { Entity, System } from '../../../Core'
import CreatureAttributes, {
  CREATURE_STATUS
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import LanePosition from '../Components/LanePosition'
import { MAX_LANE_POSITION, TICK } from '../constants'

export default class AtackSystem extends System {
  private time: number = 0

  hasOpponentCreatureOnPosition(
    lane: number,
    attackPosition: number,
    isOpponent: boolean = false
  ): boolean {
    const player = this.entityManager.getEntityByTag(
      isOpponent ? 'player' : 'opponent'
    )
    const creatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player || -1
    ) as CreatureCollection

    return creatures.entities.some((creature) => {
      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        creature
      ) as LanePosition

      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        creature
      ) as CreatureAttributes

      return (
        lanePosition.lane === lane &&
        (!isOpponent
          ? attackPosition >= lanePosition.position
          : attackPosition <= lanePosition.position)
      )
    })
  }

  checkIfCreaturesAreAttacking(player: Entity, isOpponent: boolean = false) {
    const creatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player
    ) as CreatureCollection
    creatures.entities.forEach((creature) => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        creature
      ) as CreatureAttributes
      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        creature
      ) as LanePosition

      const modifier = isOpponent ? -1 : 1
      const attackPosition =
        lanePosition.position + creatureAttributes.range * modifier

      if (
        this.hasOpponentCreatureOnPosition(
          lanePosition.lane,
          attackPosition,
          isOpponent
        ) ||
        attackPosition <= 0 ||
        attackPosition >= MAX_LANE_POSITION
      ) {
        creatureAttributes.status = CREATURE_STATUS.ATACKING
      }
    })
  }

  update(dt: number) {
    this.time += dt
    if (this.time < TICK) return
    this.time = 0

    const player = this.entityManager.getEntityByTag('player') || -1
    const opponent = this.entityManager.getEntityByTag('opponent') || -1
    this.checkIfCreaturesAreAttacking(player)
    this.checkIfCreaturesAreAttacking(opponent, true)
  }
}
