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
// import LaneSelectionSystem from '../Systems/LaneSelectionSystem'

const TICK = 1000

export default class MainScene extends Scene {
  facotry?: Factory
  text?: GameObjects.Text

  create() {
    // frame
    const frame = this.add.rectangle(8, 8, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0)
    frame.setDisplayOrigin(0, 0)
    frame.setStrokeStyle(8, FRAME_COLOR)

    // debug text object
    this.text = this.add.text(
      CANVAS_WIDTH + 16,
      0,
      `${PLAYER_HAND_DISPLAY_ORIGIN} - ${OPPONENT_HAND_DISPLAY_ORIGIN}`,
      {
        color: '#fff',
        fontSize: '10px',
      },
    )

    // create entities
    this.facotry = new Factory(this.entityManager, this.add, this.input)
    this.facotry.player()
    this.facotry.opponent()

    // boot systems
    this.systems = [
      new MouseInputSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new ManaSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input),
      // new LaneSelectionSystem(this.entityManager, this.add, this.input),
      // new AttackSystem(this.entityManager, this.add, this.input),
      // new LaneMovementSystem(this.entityManager, this.add, this.input),
    ]

    super.create()
  }

  update(time: number, dt: number) {
    const opponent = this.entityManager?.getEntityByTag('opponent')
    const player = this.entityManager?.getEntityByTag('player')
    if (!opponent || !player) return
    const playerHand = this.entityManager.getComponentOfClass(
      Hand,
      player,
    ) as Hand

    this.text?.setText(this.debug(...playerHand.cards))
    super.update(dt)
  }

  debug(...entities: Entity[]): string {
    return (entities.length ? entities : this.entityManager.getAllEntities())
      .map(entity => {
        const tag = this.entityManager.getTagByEntity(entity)
        let msg = `--${tag || entity}--\n`
        msg += this.debugEntity(entity)
        return msg
      })
      .join('\n\n---------\n\n')
  }

  debugEntity(entity: Entity): string {
    return this.entityManager
      .getComponents(entity)
      .map(this.debugComponent)
      .join('\n')
  }

  debugComponent(component: Component) {
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

    return msg
  }
}
