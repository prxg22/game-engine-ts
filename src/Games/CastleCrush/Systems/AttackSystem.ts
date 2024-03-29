import { GameObjects } from 'phaser'
import { Entity, System } from '../../../Core'
import MainScene from '../../LunaLander/Scenes/MainScene'
import Attack from '../Components/Attack'
import CreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import Health from '../Components/Health'
import LanePosition from '../Components/LanePosition'
import Renderer from '../Components/Renderer'
import { LANE_SIZE, CLOCK, P1_TAG, P2_TAG, LANES } from '../constants'
import BaseSystem from '../Core/BaseSystem'

export default class AtackSystem extends BaseSystem {
  hitCreature(hit: number, creatures: Entity[]) {
    creatures.forEach(creature => {
      const health = this.entityManager.getComponentOfClass(
        Health,
        creature,
      ) as Health

      health.hit(hit)
    })
  }

  resolveDamage(attack: Attack, opponentsOnRange: Entity[][]) {
    let targets = opponentsOnRange
      .slice(0, attack.spread ? attack.range : 1)
      .flat()
    if (!attack.area) targets = [targets[0]]

    this.hitCreature(attack.power, targets)
  }

  resolveCreatureAttack(owner: Entity, creature: Entity) {
    const lanePosition = this.entityManager.getComponentOfClass(
      LanePosition,
      creature,
    ) as LanePosition
    const attack = this.entityManager.getComponentOfClass(
      Attack,
      creature,
    ) as Attack
    const creatureAttributes = this.entityManager.getComponentOfClass(
      CreatureAttributes,
      creature,
    ) as CreatureAttributes

    const attackPosition =
      creatureAttributes.speed + lanePosition.position + attack.range
    const opponentsOnRange = this.entityManager.getOpponentCreaturesOnRange(
      owner,
      lanePosition.lane,
      lanePosition.position,
      attackPosition,
    )

    if (attackPosition >= LANE_SIZE)
      opponentsOnRange.push([this.entityManager.getOpponent(owner)])

    creatureAttributes.status =
      opponentsOnRange.length && opponentsOnRange[0].length
        ? CREATURE_STATUS.ATACKING
        : CREATURE_STATUS.MOVING

    const isAttacking = creatureAttributes.status === CREATURE_STATUS.ATACKING

    if (isAttacking) {
      this.resolveDamage(attack, opponentsOnRange)
    }
  }

  update() {
    const player1 = this.entityManager.player1
    const player2 = this.entityManager.player2

    ;[player1, player2].forEach(player => {
      for (let lane = 0; lane < LANES; lane++) {
        const creatures = this.entityManager.getPlayerCreaturesOnLaneSortedByRange(
          player,
          lane,
        )

        creatures.forEach(creature => {
          this.resolveCreatureAttack(player, creature)
        })
      }
    })
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
