import { Entity, System } from '../../../Core'
import Attack from '../Components/Attack'
import CreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import LanePosition from '../Components/LanePosition'
import { LANE_SIZE, CLOCK, P1_TAG, P2_TAG } from '../constants'
import BaseSystem from '../Core/BaseSystem'

export default class AtackSystem extends BaseSystem {
  hasOpponentCreatureOnPosition(
    lane: number,
    attackPosition: number,
    isOpponent: boolean = false,
  ): boolean {
    const player = this.entityManager.getEntityByTag(
      isOpponent ? P1_TAG : P2_TAG,
    )
    const creatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player || -1,
    ) as CreatureCollection

    return creatures.entities.some(creature => {
      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        creature,
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
      player,
    ) as CreatureCollection
    creatures.entities.forEach(creature => {
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        creature,
      ) as CreatureAttributes
      const attack = this.entityManager.getComponentOfClass(
        Attack,
        creature,
      ) as Attack
      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        creature,
      ) as LanePosition

      const modifier = isOpponent ? -1 : 1
      const attackPosition = lanePosition.position + attack.range * modifier

      if (
        this.hasOpponentCreatureOnPosition(
          lanePosition.lane,
          attackPosition,
          isOpponent,
        ) ||
        attackPosition <= 0 ||
        attackPosition >= LANE_SIZE
      ) {
        creatureAttributes.status = CREATURE_STATUS.ATACKING
      }
    })
  }

  isCreatureAttacking(creature: Entity, owner: Entity): boolean {
    const isPlayer1 = this.entityManager.isPlayer1(owner)
    const attack = this.entityManager.getComponentOfClass(
      Attack,
      creature,
    ) as Attack
    const lanePosition = this.entityManager.getComponentOfClass(
      LanePosition,
      creature,
    ) as LanePosition

    const attackPosition = lanePosition.position + attack.range
  }

  resolvePlayerAttack(owner: string | Entity) {
    const creaturesCollection = this.entityManager.getComponentOfClass(
      CreatureCollection,
      owner,
    ) as CreatureCollection

    creaturesCollection.entities.forEach(creature => {
      const isAttacking = this.isCreatureAttacking(creature, owner)
    })
  }

  clock() {
    const player1 = this.entityManager.player1 || -1
    const player2 = this.entityManager.player2 || -1
    this.checkIfCreaturesAreAttacking(player1)
    this.checkIfCreaturesAreAttacking(player2, true)
  }
}

// iterar sobre as criaturas de uma entity
// (poderia organizar elas por lane e posição mais distante alcançada,
// assim posso abandonar caso o loop caso uma criatura não alacance um oponente)

// verificar, para cada posição em que há uma criatura da entity "owner",
// se há uma criatura do oponente.
// se não houver, passar reto (lembrando que eu poderia parar o loop aqui)
// se houver, marcar a criatura com status ATTACKING e

// encontrar todas as criaturas que ele pode atacar (calcular range + spread + area) e
// calcular dano em todas estas criaturas
