import { Entity } from '../../../Core'
import CreatureCollection from '../Components/CreatureCollection'
import Health from '../Components/Health'
import Renderer from '../Components/Renderer'
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
    })
  }
}
