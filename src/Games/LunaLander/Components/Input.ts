import Phaser from 'phaser'
import { Component } from '../../../Core'

class Input extends Component {
  constructor(public responsiveKeys: Phaser.Input.Keyboard.Key[]) {
    super()
  }
}

export default Input
