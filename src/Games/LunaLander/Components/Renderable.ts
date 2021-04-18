import { Component } from '../../../Core'

class Renderable<
  T extends Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
> extends Component {
  constructor(
    public sprite: T,
    public scale: number = 1,
    public rotation: number = 0
  ) {
    super()
    this.sprite.setRotation(rotation)
    this.sprite.setScale(scale)
  }

  rotate(amount: number) {
    this.rotation += amount
  }
}

export default Renderable
