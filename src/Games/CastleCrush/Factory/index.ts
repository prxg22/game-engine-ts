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
  PLAYER_CARD_SIZE,
  OPPONENT_CARD_SIZE,
  PLAYER_HAND_DISPLAY_ORIGIN,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_CARD_COLOR,
  OPPONENT_CARD_COLOR,
} from '../constants'
import CreatureAttributes from '../Components/CreatureAttributes'
import LanePosition from '../Components/LanePosition'
import LaneSelection from '../Components/LaneSelection'
import Renderer from '../Components/Renderer'
import MouseInput from '../Components/MouseInput'
import getHandCardsPositions from '../Utils/getHandCardsPositions'

let instance: Factory
export default class Factory {
  constructor(
    public entityManager: EntityManager,
    public factory: Phaser.GameObjects.GameObjectFactory,
    public input: Phaser.Input.InputPlugin,
  ) {
    if (instance) return instance

    instance = this
  }

  static get instance(): Factory {
    if (!instance)
      throw Error(
        '[FACTORY] Trying to access intance, but factory is not initiated',
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
      'creature-1',
    ]

    const [width, height] = PLAYER_CARD_SIZE
    const handCardsPositions = getHandCardsPositions().map(([x, y]) => ({
      x,
      y,
      width,
      height,
    }))

    console.log(handCardsPositions)
    this.entityManager.addComponent(
      new MouseInput(...handCardsPositions),
      player,
    )

    this.entityManager.addComponent(new Mana(12, 0), player)
    this.entityManager.addComponent(new Health(1000), player)
    this.entityManager.addComponent(new Deck(cards), player)
    this.entityManager.addComponent(new Hand(), player)
    this.entityManager.addComponent(new LaneSelection(), player)
    this.entityManager.addComponent(new CreatureCollection(), player)

    // this.entityManager.addComponent(
    //   new Input([
    //     this.input.keyboard.addKey(HAND_ONE_KEY),
    //     this.input.keyboard.addKey(HAND_TWO_KEY),
    //     this.input.keyboard.addKey(HAND_THREE_KEY),
    //     this.input.keyboard.addKey(HAND_FOUR_KEY),
    //     this.input.keyboard.addKey(HAND_FIVE_KEY),
    //   ]),
    //   player,
    // )

    // this.entityManager.addComponent(new Renderer(this.factory.), player)

    return player
  }

  opponent(): Entity {
    const opponent = this.entityManager.createEntity('opponent')

    const cards = [
      'creature-1',
      'creature-2',
      'creature-3',
      'creature-4',
      'creature-1',
    ]

    this.entityManager.addComponent(new Mana(12, 0), opponent)
    this.entityManager.addComponent(new Health(1000), opponent)
    this.entityManager.addComponent(new Deck(cards), opponent)
    this.entityManager.addComponent(new Hand(), opponent)
    this.entityManager.addComponent(new CreatureCollection(), opponent)

    // this.entityManager.addComponent(new Renderer(this.factory.), opponent)

    return opponent
  }

  card(name: string, entity: Entity, handPosition: number): Entity {
    const isPlayer = entity === this.entityManager.getEntityByTag('player')
    const size = isPlayer ? PLAYER_CARD_SIZE : OPPONENT_CARD_SIZE
    const color = isPlayer ? PLAYER_CARD_COLOR : OPPONENT_CARD_COLOR
    const displayOrigin = isPlayer
      ? PLAYER_HAND_DISPLAY_ORIGIN
      : OPPONENT_HAND_DISPLAY_ORIGIN

    const card = this.entityManager.createEntity()

    const { type, mana }: { type: CARD_TYPE; mana: number } = CARDS[name]

    this.entityManager.addComponent(new CardDescriptor(name, mana, type), card)
    const renderer = new Renderer(this.factory.rectangle())
    this.entityManager.addComponent(renderer, card)

    const [width, height] = size
    renderer.sprite.setDisplaySize(width, height)
    renderer.sprite.setFillStyle(color)

    const [originX, originY] = displayOrigin
    renderer.sprite.setPosition(handPosition * width * 2 + originX, originY)

    return card
  }

  creature(card: Entity, lane: number, position?: number): Entity {
    const creature = this.entityManager.createEntity()
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      card,
    ) as CardDescriptor

    const {
      atk,
      speed,
      hp,
      range,
    }: { atk: number; speed: number; hp: number; range: number } = CARDS[
      descriptor.name
    ]

    this.entityManager.addComponent(new Health(hp), creature)
    this.entityManager.addComponent(
      new CreatureAttributes(descriptor.name, speed, atk, range),
      creature,
    )
    this.entityManager.addComponent(new LanePosition(lane, position), creature)

    return creature
  }
}
