import { GameObjects } from 'phaser'
import { Component, Entity, Scene } from '../../../Core'
import Renderer from '../Components/Renderer'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FRAME_COLOR,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_HAND_DISPLAY_ORIGIN,
} from '../constants'
import Factory from '../Factory'
import DrawSystem from '../Systems/DrawSystem'
import HandSystem from '../Systems/HandSystem'
// import LaneMovementSystem from '../Systems/LaneMovementSystem'
// import AttackSystem from '../Systems/AttackSystem'
import MouseInputSystem from '../Systems/MouseInputSystem'
import Hand from '../Components/Hand'
import ManaSystem from '../Systems/ManaSystem'
import LaneSelectionSystem from '../Systems/LaneSelectionSystem'

const CLOCK = 1000
let instance: MainScene
export default class MainScene extends Scene {
  facotry?: Factory
  text?: GameObjects.Text

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    instance = this
  }
  static instance(): MainScene {
    return instance
  }

  create() {
    // frame
    const frame = this.add.rectangle(8, 8, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0)
    frame.setDisplayOrigin(0, 0)
    frame.setStrokeStyle(8, FRAME_COLOR)

    // debug text object
    this.text = this.add.text(CANVAS_WIDTH + 16, 0, ``, {
      color: '#fff',
      fontSize: '10px',
    })

    // create entities
    this.facotry = new Factory(this.entityManager, this.add, this.input)
    this.facotry.player()
    this.facotry.opponent()
    this.facotry.lanes()

    // boot systems
    this.systems = [
      new MouseInputSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new ManaSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input),
      new LaneSelectionSystem(this.entityManager, this.add, this.input),
      // new AttackSystem(this.entityManager, this.add, this.input),
      // new LaneMovementSystem(this.entityManager, this.add, this.input),
    ]

    super.create()
  }

  private t: number = 0
  update(time: number, dt: number) {
    const opponent = this.entityManager?.getEntityByTag('opponent')
    const player = this.entityManager?.getEntityByTag('player')
    const lanes = [
      this.entityManager?.getEntityByTag('lane-0') || -1,
      this.entityManager?.getEntityByTag('lane-1') || -1,
      this.entityManager?.getEntityByTag('lane-2') || -1,
    ]
    if (!opponent || !player) return
    const playerHand = this.entityManager.getComponentOfClass(
      Hand,
      player,
    ) as Hand

    // this.debugEntities(player, ...lanes)
    super.update(dt)
  }

  debugEntities(...entities: (Entity | string)[]): string {
    const msg = (entities.length
      ? entities
      : this.entityManager.getAllEntities()
    )
      .map(entityOrTag => {
        const isTag = typeof entityOrTag === 'string'
        const entity = (isTag
          ? this.entityManager.getEntityByTag(entityOrTag as string)
          : entityOrTag) as Entity
        const tag = (isTag
          ? entityOrTag
          : this.entityManager.getTagByEntity(entityOrTag as Entity)) as string
        let msg = `--${tag || entity}--\n`
        msg += this.debugEntity(entity)
        return msg
      })
      .join('\n\n---------\n\n')
    this.text?.setText(msg)
    return msg
  }

  debugEntity(entity: Entity): string {
    const msg = this.entityManager
      .getComponents(entity)
      .map(this.debugComponent)
      .join('\n')

    this.text?.setText(msg)
    return msg
  }

  debugComponent(component: Component): string {
    let msg = `${component.toString()}: `
    if (component instanceof Renderer) {
      msg += `\nsprite.x: ${component.sprite.x} sprite.y: ${component.sprite.y}\n`
      return msg
    }

    msg += Object.entries(component)
      .map(([key, value]): string => {
        return ` ${key}: ${value}`
      })
      .join('\n')

    this?.text?.setText(msg)
    return msg
  }

  debug(...msg: string[]): string[] {
    this?.text?.setText(msg)
    return msg
  }
}
