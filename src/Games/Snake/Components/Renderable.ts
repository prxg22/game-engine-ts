import { Component } from '../../../Core'

class Renderable<
  T extends
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.Shape
> extends Component {
  constructor(public sprite: T) {
    super()
    this.sprite.setDisplayOrigin(0, 0)
  }
}

export default Renderable
