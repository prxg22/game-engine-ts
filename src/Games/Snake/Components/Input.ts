import Phaser from 'phaser'
import { Component } from '../../../Core'

class Input extends Component {
  constructor(public keys: Phaser.Input.Keyboard.Key[]) {
    super()
  }

  get down(): Phaser.Input.Keyboard.Key[] {
    return this.keys.filter((key) => key.isDown)
  }
}

export default Input
