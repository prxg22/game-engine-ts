import { GameObjects } from 'phaser'
import { Component, Entity, Scene } from '../../../Core'
import Renderer from '../Components/Renderer'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FRAME_COLOR,
  P2_HAND_DISPLAY_ORIGIN,
  P1_HAND_DISPLAY_ORIGIN,
} from '../constants'
import Factory from '../Factory'
import DrawSystem from '../Systems/DrawSystem'
import HandSystem from '../Systems/HandSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'
import AttackSystem from '../Systems/AttackSystem'
import MouseInputSystem from '../Systems/MouseInputSystem'
import Hand from '../Components/Hand'
import ManaSystem from '../Systems/ManaSystem'
import LaneSelectionSystem from '../Systems/LaneSelectionSystem'
import SetCardSystem from '../Systems/SetCardSystem'
import BaseScene from './BaseScene'

const TICK = 1000
let instance: MainScene
export default class MainScene extends BaseScene {
  factory?: Factory
  text?: GameObjects.Text

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    instance = this
  }
  static instance(): MainScene {
    return instance
  }

  create() {
    // debug text object
    this.text = this.add.text(CANVAS_WIDTH + 16, 0, ``, {
      color: '#fff',
      fontSize: '10px',
    })

    // create entities
    this.factory = new Factory(this.entityManager, this.add, this.input)
    const player = this.factory.player()
    const opponent = this.factory.opponent()
    this.factory.lanes()

    // mock oponents creatures
    Array(Phaser.Math.Between(2, 6))
      .fill(0)
      .forEach(() => {
        this.factory?.mockCreature(opponent)
      })
    Array(Phaser.Math.Between(2, 6))
      .fill(0)
      .forEach(() => {
        this.factory?.mockCreature(player)
      })

    // boot systems
    this.systems = [
      new MouseInputSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new ManaSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input),
      new LaneSelectionSystem(this.entityManager, this.add, this.input),
      new SetCardSystem(this.entityManager, this.add, this.input),
      new LaneMovementSystem(this.entityManager, this.add, this.input),
      new AttackSystem(this.entityManager, this.add, this.input),
    ]

    super.create()
  }

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
    super.update(time, dt)
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

  debugComponent(component?: Component): string {
    if (!component) return ''
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
