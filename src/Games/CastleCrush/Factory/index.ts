import Phaser, { Game, GameObjects } from 'phaser'
import { Entity } from '../../../Core'
import CARDS from '../Cards/*.json'
import Deck from '../Components/Deck'
import Health from '../Components/Health'
import Mana from '../Components/Mana'
import Hand from '../Components/Hand'
import CreatureCollection from '../Components/CreatureCollection'
import CardDescriptor, { CARD_TYPE } from '../Components/CardDescriptor'
import CreatureAttributes, {
  CREATURE_STATUS,
} from '../Components/CreatureAttributes'
import LaneSelection from '../Components/LaneSelection'
import LanePosition from '../Components/LanePosition'
import Renderer from '../Components/Renderer'
import getHandCardsPositions from '../Utils/getHandCardsPositions'
import {
  P1_CARD_SIZE,
  P2_CARD_SIZE,
  P1_HAND_DISPLAY_ORIGIN,
  P2_HAND_DISPLAY_ORIGIN,
  FRONTCOVER_CARD_COLOR,
  BACKCOVER_CARD_COLOR,
  LANE_DISPLAY_ORIGIN,
  LANE_DISPLAY_SIZE,
  LANE_MARGIN_SIZE,
  LANE_COLOR,
  LANES,
  CREATURE_SIZE,
  CREATURE_COLOR_MOVING,
  LANE_SIZE,
  P1_CREATURE_COLOR_MOVING,
  P2_CREATURE_COLOR_MOVING,
  P1_TAG,
  P2_TAG,
} from '../constants'
import MouseInput from '../Components/MouseInput'
import MouseInputSystem from '../Systems/MouseInputSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'
import Attack, { AttackDescriptor } from '../Components/Attack'
import BaseEntityManager from '../Core/BaseEntityManager'
import Input from '../Components/Input'

let instance: Factory
export default class Factory {
  constructor(
    public entityManager: BaseEntityManager,
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

  player1(): Entity {
    const player = this.entityManager.createEntity(P1_TAG)

    // deck cards
    const cards = [
      'creature-1',
      'creature-1',
      'creature-1',
      'creature-1',
      'creature-3',
      'creature-2',
      'creature-3',
      'creature-2',
      'creature-4',
      'creature-4',
      'creature-2',
      'creature-4',
    ]

    // hand responsive area
    this.entityManager.addComponent(new Mana(1, 0), player)
    this.entityManager.addComponent(new Health(1000), player)
    this.entityManager.addComponent(new Deck(cards), player)
    this.entityManager.addComponent(new Hand(), player)
    this.entityManager.addComponent(new LaneSelection(), player)
    this.entityManager.addComponent(new CreatureCollection(), player)
    this.entityManager.addComponent(
      new Input([
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      ]),
      player,
    )

    return player
  }

  player2(): Entity {
    const player = this.entityManager.createEntity(P2_TAG)

    const cards = [
      'creature-1',
      'creature-1',
      'creature-1',
      'creature-1',
      'creature-1',
    ]

    this.entityManager.addComponent(new Mana(1, 0), player)
    this.entityManager.addComponent(new Health(1000), player)
    this.entityManager.addComponent(new Deck(cards), player)
    this.entityManager.addComponent(new Hand(), player)
    const creatureCollection = new CreatureCollection()
    this.entityManager.addComponent(creatureCollection, player)

    return player
  }

  mockCreature(owner: Entity) {
    const isPlayer1 = this.entityManager.isPlayer1(owner)
    const creatureCollection = this.entityManager.getComponentOfClass(
      CreatureCollection,
      owner,
    ) as CreatureCollection

    // create random cards
    const card = this.card(`creature-${Phaser.Math.Between(1, 4)}`, owner, 0)

    // create a creature
    const creature = this.creature(
      owner,
      card,
      Phaser.Math.Between(0, 2),
      Phaser.Math.Between(0, LANE_SIZE / 2),
    )

    // push creature in owner's creatureCollection
    creatureCollection?.entities.push(creature)

    const creatureAttributes = this.entityManager.getComponentOfClass(
      CreatureAttributes,
      creature,
    ) as CreatureAttributes

    const renderer = this.entityManager.getComponentOfClass(
      Renderer,
      creature,
    ) as Renderer<GameObjects.Shape>

    creatureAttributes.status = CREATURE_STATUS.MOVING

    renderer.sprite.setFillStyle(
      isPlayer1 ? P1_CREATURE_COLOR_MOVING : P2_CREATURE_COLOR_MOVING,
    )
    // since we will not use it, remove card owner
    this.entityManager.removeEntity(card)
  }

  lanes(): Entity[] {
    const lanes: Entity[] = []

    for (let laneNumber = 0; laneNumber < LANES; laneNumber++) {
      const lane = this.entityManager.createEntity(`lane-${laneNumber}`)
      const [baseX, baseY] = LANE_DISPLAY_ORIGIN
      const [baseWidth, baseHeight] = LANE_DISPLAY_SIZE
      const sprite = this.factory.rectangle(
        baseX,
        baseY - (LANE_MARGIN_SIZE + baseHeight) * 2 * laneNumber,
        baseWidth,
        baseHeight,
        LANE_COLOR,
      )
      const renderer = new Renderer(sprite)
      this.entityManager.addComponent(renderer, lane)

      const mouse = new MouseInput()

      this.entityManager.addComponent(mouse, lane)

      MouseInputSystem.bindMouseClickEvent(renderer, mouse)
      lanes.push(lane)
    }

    return lanes
  }

  card(file: string, owner: Entity, handPosition: number): Entity {
    const isPlayer1 = this.entityManager.isPlayer1(owner)

    const card = this.entityManager.createEntity()

    // renderer
    const displayOrigin = isPlayer1
      ? P1_HAND_DISPLAY_ORIGIN
      : P2_HAND_DISPLAY_ORIGIN
    const color = isPlayer1 ? FRONTCOVER_CARD_COLOR : BACKCOVER_CARD_COLOR
    const size = isPlayer1 ? P1_CARD_SIZE : P2_CARD_SIZE
    const [originX, originY] = displayOrigin
    const [width, height] = size
    const renderer = new Renderer(this.factory.rectangle())
    renderer.sprite.setPosition(handPosition * width * 2 + originX, originY)
    renderer.sprite.setDisplaySize(width, height)
    renderer.sprite.setFillStyle(color)
    this.entityManager.addComponent(renderer, card)

    // card descriptor
    const {
      name,
      type,
      manaCost,
    }: { name: string; type: CARD_TYPE; manaCost: number } = CARDS[file]
    this.entityManager.addComponent(
      new CardDescriptor(name, manaCost, type),
      card,
    )

    // mouse
    if (isPlayer1) {
      const mouse = new MouseInput()
      this.entityManager.addComponent(mouse, card)
      MouseInputSystem.bindMouseClickEvent(renderer, mouse)
    }
    return card
  }

  creature(
    owner: Entity,
    card: Entity,
    lane: number,
    position: number = 0,
  ): Entity {
    const creature = this.entityManager.createEntity()
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      card,
    ) as CardDescriptor

    const {
      attack,
      speed,
      hp,
    }: { attack: AttackDescriptor; speed: number; hp: number } = CARDS[
      descriptor.name
    ]

    this.entityManager.addComponent(new Health(hp), creature)
    this.entityManager.addComponent(
      new Attack(attack.power, attack.range, attack.spread, attack.area),
      creature,
    )

    this.entityManager.addComponent(
      new CreatureAttributes(descriptor.name, speed),
      creature,
    )
    const lanePosition = new LanePosition(lane, position)
    this.entityManager.addComponent(lanePosition, creature)

    const [displayX, displayY] =
      LaneMovementSystem.calculateDisplayPosition(
        lanePosition,
        this.entityManager.isPlayer1(owner),
      ) || []

    const sprite = this.factory.rectangle(
      displayX,
      displayY,
      CREATURE_SIZE,
      CREATURE_SIZE,
    )

    this.entityManager.addComponent(new Renderer(sprite), creature)
    return creature
  }
}
