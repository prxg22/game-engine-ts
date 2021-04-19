import { Entity, System } from '../../../Core'
import Creature from '../Components/Creature'
import CreatureCollection from '../Components/CreatureCollection'
import Hand from '../Components/Hand'
import Input from '../Components/Input'
import Mana from '../Components/Mana'
import {
  HAND_FIVE_KEY,
  HAND_FOUR_KEY,
  HAND_ONE_KEY,
  HAND_THREE_KEY,
  HAND_TWO_KEY,
  TICK
} from '../constants'
import Factory from '../Factory'

export default class HandSystem extends System {
  inputManager: Map<Entity, Phaser.Input.Keyboard.Key | undefined> = new Map()
  private factory?: Factory
  private time: number = 0

  create() {
    const factory = Factory.instance
    this.factory = factory
  }

  update(dt: number) {
    const inputHandAndManaEntitites = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Input, Hand, Mana]
    )

    inputHandAndManaEntitites.forEach((entity) => {
      const input = this.entityManager.getComponentOfClass(
        Input,
        entity
      ) as Input

      this.inputManager.set(
        entity,
        input.down[0] || this.inputManager.get(entity)
      )

      this.time += dt
      if (this.time < TICK) return
      this.time = 0

      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand

      const key = this.inputManager.get(entity)
      this.inputManager.set(entity, undefined)

      if (!key) return

      let card: Entity = -1

      const remove = (index: number): Entity[] | undefined => {
        if (!hand.cards[0]) return
        const cards = hand.remove(hand.cards[0])
        this.entityManager.removeEntity(card)
        return cards
      }

      switch (key.keyCode) {
        case HAND_ONE_KEY:
          ;[card] = remove(0) || []
          break
        case HAND_TWO_KEY:
          ;[card] = remove(1) || []
          break
        case HAND_THREE_KEY:
          ;[card] = remove(2) || []
          break
        case HAND_FOUR_KEY:
          ;[card] = remove(3) || []
          break
        case HAND_FIVE_KEY:
          ;[card] = remove(4) || []
          break
      }

      if (card) {
        const creature = this.factory?.creature(card, 0)
        const creatureCollection = this.entityManager.getComponentOfClass(
          CreatureCollection,
          entity
        ) as CreatureCollection

        if (creature) creatureCollection.entities.push(creature)
      }
    })
  }
}
