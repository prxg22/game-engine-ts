import Phaser, { Game, GameObjects } from 'phaser'
import { Entity, EntityManager } from '../../../Core'
import CARDS from '../Cards/*.json'
import Deck from '../Components/Deck'
import Health from '../Components/Health'
import Mana from '../Components/Mana'
import Hand from '../Components/Hand'
import CreatureCollection from '../Components/CreatureCollection'
import CardDescriptor, { CARD_TYPE } from '../Components/CardDescriptor'
import CreatureAttributes from '../Components/CreatureAttributes'
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
} from '../constants'
import MouseInput from '../Components/MouseInput'
import MouseInputSystem from '../Systems/MouseInputSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'
import MainScene from '../Scenes/MainScene'

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

    // deck cards
    const cards = [
      'creature-1',
      'creature-2',
      'creature-3',
      'creature-4',
      'creature-1',
    ]

    // hand responsive area
    const [width, height] = P1_CARD_SIZE
    const handCardAreas = getHandCardsPositions().map(([x, y]) => ({
      x,
      y,
      width,
      height,
    }))

    // lane responsive area
    const [laneX, laneY] = LANE_DISPLAY_ORIGIN
    const [laneWidth, laneHeight] = LANE_DISPLAY_SIZE

    this.entityManager.addComponent(new Mana(12, 0), player)
    this.entityManager.addComponent(new Health(1000), player)
    this.entityManager.addComponent(new Deck(cards), player)
    this.entityManager.addComponent(new Hand(), player)
    this.entityManager.addComponent(new LaneSelection(), player)
    this.entityManager.addComponent(new CreatureCollection(), player)

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

    return opponent
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

  card(name: string, entity: Entity, handPosition: number): Entity {
    const isPlayer = entity === this.entityManager.getEntityByTag('player')

    const card = this.entityManager.createEntity()

    // renderer
    const displayOrigin = isPlayer
      ? P1_HAND_DISPLAY_ORIGIN
      : P2_HAND_DISPLAY_ORIGIN
    const color = isPlayer ? FRONTCOVER_CARD_COLOR : BACKCOVER_CARD_COLOR
    const size = isPlayer ? P1_CARD_SIZE : P2_CARD_SIZE
    const [originX, originY] = displayOrigin
    const [width, height] = size
    const renderer = new Renderer(this.factory.rectangle())
    renderer.sprite.setPosition(handPosition * width * 2 + originX, originY)
    renderer.sprite.setDisplaySize(width, height)
    renderer.sprite.setFillStyle(color)
    this.entityManager.addComponent(renderer, card)

    // card descriptor
    const { type, manaCost }: { type: CARD_TYPE; manaCost: number } = CARDS[
      name
    ]
    this.entityManager.addComponent(
      new CardDescriptor(name, manaCost, type),
      card,
    )

    // mouse
    if (isPlayer) {
      const mouse = new MouseInput()
      this.entityManager.addComponent(mouse, card)
      MouseInputSystem.bindMouseClickEvent(renderer, mouse)
    }
    return card
  }

  creature(card: Entity, lane: number, position?: number): Entity {
    const creature = this.entityManager.createEntity()
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      card,
    ) as CardDescriptor

    const mainScene = MainScene.instance()

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
    const lanePosition = new LanePosition(lane, position)
    this.entityManager.addComponent(lanePosition, creature)

    const [displayX, displayY] =
      LaneMovementSystem.calculateDisplayPosition(lanePosition) || []

    const sprite = this.factory.rectangle(
      displayX,
      displayY,
      CREATURE_SIZE,
      CREATURE_SIZE,
      CREATURE_COLOR_MOVING,
    )

    // mainScene.debug(
    //   `
    //   factry.cards:
    //   entity: ${card} - name: ${descriptor.name} -
    //   position: ${position}
    //   displayX: ${displayX} - displayY: ${displayY}
    //   `,
    // )
    this.entityManager.addComponent(new Renderer(sprite), creature)

    return creature
  }
}
