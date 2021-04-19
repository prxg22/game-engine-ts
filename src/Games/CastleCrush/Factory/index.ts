import Phaser, { GameObjects } from 'phaser'
import { Entity, EntityManager } from '../../../Core'
import CARDS from '../Cards/*.json'
import Deck from '../Components/Deck'
import Health from '../Components/Health'
import Mana from '../Components/Mana'
import Hand from '../Components/Hand'
import CreatureCollection from '../Components/CreatureCollection'
import Input from '../Components/Input'
import CardDescriptor, { CARD_TYPE } from '../Components/CardDescriptor'
import {
  HAND_FIVE_KEY,
  HAND_FOUR_KEY,
  HAND_ONE_KEY,
  HAND_THREE_KEY,
  HAND_TWO_KEY
} from '../constants'
import CreatureAttributes from '../Components/CreatureAttributes'
import LanePosition from '../Components/LanePosition'

let instance: Factory
export default class Factory {
  constructor(
    public entityManager: EntityManager,
    public factory: Phaser.GameObjects.GameObjectFactory,
    public input: Phaser.Input.InputPlugin
  ) {
    if (instance) return instance

    instance = this
  }

  static get instance(): Factory {
    if (!instance)
      throw Error(
        '[FACTORY] Trying to access intance, but factory is not initiated'
      )
    return instance
  }

  player(): Entity {
    const player = this.entityManager.createEntity('player')

    const cards = [
      'creature-1',
      'creature-2',
      'creature-3',
      'creature-4',
      'creature-1'
    ]

    this.entityManager.addComponent(new Mana(12, 0), player)
    this.entityManager.addComponent(new Health(1000), player)
    this.entityManager.addComponent(new Deck(cards), player)
    this.entityManager.addComponent(new Hand(), player)
    this.entityManager.addComponent(new CreatureCollection(), player)
    this.entityManager.addComponent(
      new Input([
        this.input.keyboard.addKey(HAND_ONE_KEY),
        this.input.keyboard.addKey(HAND_TWO_KEY),
        this.input.keyboard.addKey(HAND_THREE_KEY),
        this.input.keyboard.addKey(HAND_FOUR_KEY),
        this.input.keyboard.addKey(HAND_FIVE_KEY)
      ]),
      player
    )

    // this.entityManager.addComponent(new Renderer(this.factory.), player)

    return player
  }

  card(name: string): Entity {
    const card = this.entityManager.createEntity()

    const { type, mana }: { type: CARD_TYPE; mana: number } = CARDS[name]

    this.entityManager.addComponent(new CardDescriptor(name, mana, type), card)

    return card
  }

  creature(card: Entity, lane: number, position?: number): Entity {
    const creature = this.entityManager.createEntity()
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      card
    ) as CardDescriptor

    const {
      atk,
      speed,
      hp,
      range
    }: { atk: number; speed: number; hp: number; range: number } = CARDS[
      descriptor.name
    ]

    this.entityManager.addComponent(new Health(hp), creature)
    this.entityManager.addComponent(
      new CreatureAttributes(descriptor.name, speed, atk, range),
      creature
    )
    this.entityManager.addComponent(new LanePosition(lane, position), creature)

    return creature
  }
}
