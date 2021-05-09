import { GameObjects } from 'phaser'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
import Factory from '../Factory'
import DrawSystem from '../Systems/DrawSystem'
import HandSystem from '../Systems/HandSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'
import MouseInputSystem from '../Systems/MouseInputSystem'
import ManaSystem from '../Systems/ManaSystem'
import LaneSelectionSystem from '../Systems/LaneSelectionSystem'
import AttackSystem from '../Systems/AttackSystem'
import HealthSystem from '../Systems/HealthSystem'
import SetCardSystem from '../Systems/SetCardSystem'
import BaseScene from '../Core/BaseScene'
import OpponentSystem from '../Systems/OpponentSystem'

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
    // Array(Phaser.Math.Between(2, 6))
    //   .fill(0)
    //   .forEach(() => {
    this.factory?.mockCreature(player2)
    //   })

    // boot systems
    this.systems = [
      new MouseInputSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new ManaSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input),
      new LaneSelectionSystem(this.entityManager, this.add, this.input),
      new SetCardSystem(this.entityManager, this.add, this.input),
      new AttackSystem(this.entityManager, this.add, this.input),
      new LaneMovementSystem(this.entityManager, this.add, this.input),
      new HealthSystem(this.entityManager, this.add, this.input),
      new OpponentSystem(this.entityManager, this.add, this.input),
    ]

    super.create()
    // debug text object

    this.text = this.add
      .text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '', {
        fontSize: '60px',
      })
      .setVisible(false)
  }

  update(time: number, dt: number) {
    const winner = this.entityManager.winner
    if (winner > -1) {
      this.text
        ?.setVisible(true)
        .setText(
          `YOU ${winner === this.entityManager.player1 ? 'WIN' : 'LOOSE'}`,
        )
      return
    }
    super.update(time, dt)
  }
}
