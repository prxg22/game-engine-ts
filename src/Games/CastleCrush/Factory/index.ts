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
  PLAYER_CARD_SIZE,
  OPPONENT_CARD_SIZE,
  PLAYER_HAND_DISPLAY_ORIGIN,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_CARD_COLOR,
  OPPONENT_CARD_COLOR,
  PLAYER_HAND_POSITION_NAME_0,
  PLAYER_HAND_POSITION_NAME_1,
  PLAYER_HAND_POSITION_NAME_2,
  PLAYER_HAND_POSITION_NAME_3,
  PLAYER_HAND_POSITION_NAME_4,
  LANE_POSITION_NAME_0,
  LANE_POSITION_NAME_1,
  LANE_POSITION_NAME_2,
  LANE_BASE_POSITION_DISPLAY_ORIGIN,
  LANE_BASE_SIZE,
  LANE_BASE_MARGIN_SIZE,
  LANE_PROPORTION_FACTOR,
  LANE_COLOR,
  LANES,
} from '../constants'
import MouseInput from '../Components/MouseInput'
import MouseInputSystem from '../Systems/MouseInputSystem'

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
    const [width, height] = PLAYER_CARD_SIZE
    const handCardAreas = getHandCardsPositions().map(([x, y]) => ({
      x,
      y,
      width,
      height,
    }))

    // lane responsive area
    const [laneX, laneY] = LANE_BASE_POSITION_DISPLAY_ORIGIN
    const [laneWidth, laneHeight] = LANE_BASE_SIZE

    const clickAreaMap = {
      [PLAYER_HAND_POSITION_NAME_0]: handCardAreas[0],
      [PLAYER_HAND_POSITION_NAME_1]: handCardAreas[1],
      [PLAYER_HAND_POSITION_NAME_2]: handCardAreas[2],
      [PLAYER_HAND_POSITION_NAME_3]: handCardAreas[3],
      [PLAYER_HAND_POSITION_NAME_4]: handCardAreas[4],
      [LANE_POSITION_NAME_0]: {
        x: laneX,
        y: laneY,
        width: laneWidth,
        height: laneHeight,
      },
      [LANE_POSITION_NAME_1]: {
        x: laneX,
        y: laneY - laneHeight - LANE_BASE_MARGIN_SIZE,
        width: laneWidth,
        height: laneHeight,
      },
      [LANE_POSITION_NAME_2]: {
        x: laneX,
        y: laneY - 2 * (laneHeight + LANE_BASE_MARGIN_SIZE),
        width: laneWidth,
        height: laneHeight,
      },
    }

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
      const [baseX, baseY] = LANE_BASE_POSITION_DISPLAY_ORIGIN
      const [baseWidth, baseHeight] = LANE_BASE_SIZE
      const sprite = this.factory.rectangle(
        baseX,
        baseY - (LANE_BASE_MARGIN_SIZE + baseHeight) * 2 * laneNumber,
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
      ? PLAYER_HAND_DISPLAY_ORIGIN
      : OPPONENT_HAND_DISPLAY_ORIGIN
    const color = isPlayer ? PLAYER_CARD_COLOR : OPPONENT_CARD_COLOR
    const size = isPlayer ? PLAYER_CARD_SIZE : OPPONENT_CARD_SIZE
    const [originX, originY] = displayOrigin
    const [width, height] = size
    const renderer = new Renderer(this.factory.rectangle())
    renderer.sprite.setPosition(handPosition * width * 2 + originX, originY)
    renderer.sprite.setDisplaySize(width, height)
    renderer.sprite.setFillStyle(color)
    this.entityManager.addComponent(renderer, card)

    // card descriptor
    const { type, mana }: { type: CARD_TYPE; mana: number } = CARDS[name]
    this.entityManager.addComponent(new CardDescriptor(name, mana, type), card)

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
