import { Entity, EntityManager } from '../../../Core'
import Attack from '../Components/Attack'
import CreatureCollection from '../Components/CreatureCollection'
import Health from '../Components/Health'
import LanePosition from '../Components/LanePosition'
import { LANE_SIZE, P1_TAG, P2_TAG } from '../constants'

export default class BaseEntityManager extends EntityManager {
  get player1(): Entity {
    return this.getEntityByTag(P1_TAG) || -1
  }

  get player2(): Entity {
    return this.getEntityByTag(P2_TAG) || -1
  }

  get winner(): Entity {
    const health1 = this.getComponentOfClass(Health, this.player1) as Health
    const health2 = this.getComponentOfClass(Health, this.player2) as Health

    if (!health2.current) return this.player1
    if (!health1.current) return this.player2

    return -1
  }
  isPlayer1(player: Entity): boolean {
    return this.getEntityByTag(P1_TAG) === player
  }

  getPlayerCreatures(player: Entity): Entity[] {
    const creatureCollection = this.getComponentOfClass(
      CreatureCollection,
      player,
    ) as CreatureCollection

    return creatureCollection.entities
  }

  getPlayerCreaturesOnLane(player: Entity, lane: number): Entity[] {
    const creatures = this.getPlayerCreatures(player)

    return creatures.filter(creature => {
      const lanePosition = this.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      return lanePosition.lane === lane
    })
  }

  getPlayerCreaturesOnLaneSortedByRange(
    player: Entity,
    lane: number,
  ): Entity[] {
    return this.getPlayerCreaturesOnLane(player, lane).sort(
      (creature1, creature2) => {
        const c1 =
          (this.getComponentOfClass(LanePosition, creature1) as LanePosition)
            .position +
          (this.getComponentOfClass(Attack, creature1) as Attack).range

        const c2 =
          (this.getComponentOfClass(LanePosition, creature2) as LanePosition)
            .position +
          (this.getComponentOfClass(Attack, creature2) as Attack).range

        return c2 - c1
      },
    )
  }

  getPlayerCreaturesOnLaneSortedByPosition(
    player: Entity,
    lane: number,
  ): Entity[] {
    return this.getPlayerCreaturesOnLane(player, lane).sort(
      (creature1, creature2) => {
        const c1 = (this.getComponentOfClass(
          LanePosition,
          creature1,
        ) as LanePosition).position

        const c2 = (this.getComponentOfClass(
          LanePosition,
          creature2,
        ) as LanePosition).position

        return c2 - c1
      },
    )
  }

  getOpponent(player: Entity): Entity {
    return this.isPlayer1(player) ? this.player2 : this.player1
  }

  getOpponentCreaturesOnRange(
    player: Entity,
    lane: number,
    lower: number,
    upper: number,
  ): Entity[][] {
    const opponent = this.getOpponent(player)
    const creatures = this.getPlayerCreaturesOnLaneSortedByPosition(
      opponent,
      lane,
    )

    let creaturesOnRange: Entity[][] = []
    let lastPosition = 0
    let positionIndex = -1
    for (let i = 0; i < creatures.length; i++) {
      const creature = creatures[i]
      const position =
        LANE_SIZE -
        (this.getComponentOfClass(LanePosition, creature) as LanePosition)
          .position

      if (position < lower || position > upper) continue

      if (position !== lastPosition) {
        lastPosition = position
        positionIndex += 1
        creaturesOnRange[positionIndex] = []
      }

      creaturesOnRange[positionIndex].push(creature)
    }

    return creaturesOnRange
  }

  getPlayerFurthestCreatureOnLane(player: Entity, lane: number): Entity {
    const creatures = this.getPlayerCreaturesOnLaneSortedByPosition(
      player,
      lane,
    )
    if (!creatures.length) return -1

    return creatures[0]
  }

  getPlayerFurthestCreature(player: Entity): Entity {
    let furthest = -1
    let furthestPosition = -1
    for (let lane = 0; lane < LANE_SIZE; lane++) {
      const creature = this.getPlayerFurthestCreatureOnLane(player, lane)

      const lanePosition = this.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      if (creature > 0 && lanePosition.position > furthestPosition) {
        furthest = creature
        furthestPosition = lanePosition.position
      }
    }

    return furthest
  }
}
