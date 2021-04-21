import { GameObjects, Scene } from 'phaser'
import { LANE_COLOR } from '../constants'

export default class TestScene extends Scene {
  text?: GameObjects.Text
  shape?: GameObjects.Shape
  create() {
    this.shape = this.add
      .rectangle(100, 100, 100, 100, LANE_COLOR)
      .setDisplayOrigin(0, 0)
      .setInteractive()

    this.text = this.add.text(100, 208, this.message).setDisplayOrigin(0, 0)
  }
  get message(): string {
    return `${this.shape?.input.localX} - ${this.shape?.input.localY}`
  }
  update() {
    if (this.input.mousePointer.leftButtonDown())
      this.text?.setText(this.message)
  }
}
