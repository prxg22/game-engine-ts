import { Entity } from '../../../Core'
import Attack from '../Components/Attack'
import CreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import CreatureCollection from '../Components/CreatureCollection'
import Health from '../Components/Health'
import LanePosition from '../Components/LanePosition'
import Renderer from '../Components/Renderer'
import {
  CREATURE_SIZE,
  HEALTH_DISPLAY_OFFSET,
  LANE_SIZE,
  P1_HAND_DISPLAY_ORIGIN,
  P2_HAND_DISPLAY_ORIGIN,
} from '../constants'
import BaseSystem from '../Core/BaseSystem'

export default class HealthSystem extends BaseSystem {
  removeCreature(owner: Entity, creature: Entity) {
    const creatureCollection = this.entityManager.getComponentOfClass(
      CreatureCollection,
      owner,
    ) as CreatureCollection
    const renderer = this.entityManager.getComponentOfClass(
      Renderer,
      creature,
    ) as Renderer<Phaser.GameObjects.Shape>
    const health = this.entityManager.getComponentOfClass(
      Health,
      creature,
    ) as Health
    renderer.sprite.destroy()
    creatureCollection.remove(creature)
    this.texts[health.id]?.destroy()
    this.entityManager.removeEntity(creature)
  }

  removePlayer(player: Entity) {
    this.entityManager
      .getPlayerCreatures(player)
      .forEach(creatures => this.removeCreature(player, creatures))

    // this.entityManager.removeEntity(player)
  }

  clock(dt: number) {
    const players = [this.entityManager.player1, this.entityManager.player2]

    players.forEach(player => {
      const creatures = this.entityManager.getPlayerCreatures(player)

      creatures.forEach(creature => {
        const health = this.entityManager.getComponentOfClass(
          Health,
          creature,
        ) as Health

        if (health.current) return
        this.removeCreature(player, creature)
      })

      const health = this.entityManager.getComponentOfClass(
        Health,
        player,
      ) as Health

      if (health.current) return

      this.render()
      this.removePlayer(player)
    })
  }

  texts: { [key: number]: Phaser.GameObjects.Text } = []

  render() {
    const healthEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Health],
    )

    healthEntities.forEach(entity => {
      const isPlayer1 = this.entityManager.isPlayer1(entity)
      const creatureAttributes = this.entityManager.getComponentOfClass(
        CreatureAttributes,
        entity,
      ) as CreatureAttributes

      const lanePosition = this.entityManager.getComponentOfClass(
        LanePosition,
        entity,
      ) as LanePosition

      const health = this.entityManager.getComponentOfClass(
        Health,
        entity,
      ) as Health

      const renderer = this.entityManager.getComponentOfClass(
        Renderer,
        entity,
      ) as Renderer<Phaser.GameObjects.Shape>

      const attack = this.entityManager.getComponentOfClass(
        Attack,
        entity,
      ) as Attack

      if (renderer) {
        const msg = `${creatureAttributes.name}\nhp:${health.toString()}\nx:${
          lanePosition.position
        }\npwr: ${attack.power}\nrng: ${attack.range}\nar: ${
          attack.area
        }\nspr:${attack.spread}`

        this.texts[health.id] = (
          this.texts[health.id] ||
          this.gameObjectFactory.text(0, 0, '', {
            fontSize: '11px',
            color: '#FFD447',
          })
        )
          .setText(msg)
          .setPosition(
            renderer.sprite.x - CREATURE_SIZE,
            renderer.sprite.y + CREATURE_SIZE + CREATURE_SIZE / 2,
          )

        return
      }

      const [displayX, displayY] = isPlayer1
        ? P1_HAND_DISPLAY_ORIGIN
        : P2_HAND_DISPLAY_ORIGIN

      const [x, y] = [displayX - HEALTH_DISPLAY_OFFSET, displayY]
      this.texts[health.id] = (
        this.texts[health.id] ||
        this.gameObjectFactory.text(x, y, health.toString())
      ).setText(health.toString())
    })
  }
}
