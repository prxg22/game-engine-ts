import Phaser from 'phaser'
import { Component } from '../../../Core'
import { MAX_MANA, MIN_MANA } from './ManaComponent'

class ManaRendererComponent implements Component {
  private _max: number = 0
  private _current: number = 0

  constructor(
    public node: Phaser.GameObjects.Text,
    max: number = MAX_MANA,
    current: number = MIN_MANA
  ) {
    this.setText(current, max)
    this.node.setPosition(400, 550)
    this.node.setFill('#ff00ff')
  }

  setText(current?: number, max?: number) {
    this._max = max || this._max
    this._current = current || this._current

    this.node.setText(`${this._current}/${this._max}`)
  }
}

export default ManaRendererComponent
