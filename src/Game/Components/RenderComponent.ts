import Phaser from 'phaser'
import Component from '../Core/Component'

class RenderComponent implements Component {
  constructor(public node: Phaser.GameObjects.Shape) {
    this.node.setOrigin(0, 0)
  }
}

export default RenderComponent
