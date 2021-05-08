import { Entity } from '../../../Core'
import CreatureCollection from '../Components/CreatureCollection'
import Health from '../Components/Health'
import Renderer from '../Components/Renderer'
import {
  HEALTH_DISPLAY_OFFSET,
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
    renderer.sprite.destroy()
    creatureCollection.remove(creature)
    this.entityManager.removeEntity(creature)
  }

  removePlayer(player: Entity) {
    this.entityManager
      .getPlayerCreatures(player)
      .forEach(creatures => this.removeCreature(player, creatures))

    this.entityManager.removeEntity(player)
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

      this.removePlayer(player)
    })
  }

  texts: Phaser.GameObjects.Text[] = []
  render() {
    const players = [this.entityManager.player1, this.entityManager.player2]

    players.forEach((player, i) => {
      const health = this.entityManager.getComponentOfClass(
        Health,
        player,
      ) as Health

      const isPlayer1 = this.entityManager.isPlayer1(player)
      const [displayX, displayY] = isPlayer1
        ? P1_HAND_DISPLAY_ORIGIN
        : P2_HAND_DISPLAY_ORIGIN

      const [x, y] = [displayX - HEALTH_DISPLAY_OFFSET, displayY]
      this.texts[i] = this.texts[i]
        ? this.texts[i].setText(health.toString())
        : this.gameObjectFactory.text(x, y, health.toString())
    })
  }
}
