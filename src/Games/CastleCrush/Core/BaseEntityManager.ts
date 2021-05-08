import { Entity, EntityManager } from '../../../Core'
import CreatureCollection from '../Components/CreatureCollection'
import { P1_TAG, P2_TAG } from '../constants'

export default class BaseEntityManager extends EntityManager {
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

  get player1(): Entity | undefined {
    return this.getEntityByTag(P1_TAG)
  }

  get player2(): Entity | undefined {
    return this.getEntityByTag(P2_TAG)
  }
}
