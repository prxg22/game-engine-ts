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
import MouseInputSystem from '../Systems/MouseInputSystem'
import ManaSystem from '../Systems/ManaSystem'
import LaneSelectionSystem from '../Systems/LaneSelectionSystem'
import SetCardSystem from '../Systems/SetCardSystem'
import BaseScene from '../Core/BaseScene'

export default class MainScene extends BaseScene {
  factory?: Factory
  text?: GameObjects.Text

  create() {
    // create entities
    this.factory = new Factory(this.entityManager, this.add, this.input)
    const player1 = this.factory.player1()
    const player2 = this.factory.player2()
    this.factory.lanes()

    // mock oponents creatures
    Array(Phaser.Math.Between(2, 6))
      .fill(0)
      .forEach(() => {
        this.factory?.mockCreature(player2)
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
      // new AttackSystem(this.entityManager, this.add, this.input)
    ]

    super.create()
    // debug text object
    this.setTextPosition(CANVAS_WIDTH + 16, 16)
  }
}
