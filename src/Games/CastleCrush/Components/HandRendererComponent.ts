import Phaser from 'phaser'
import { Component, Entity } from '../../../Core'
import { CardDescriptor } from './CardDescriptorComponent'

class HandRendererComponent implements Component {
  private _origin: [number, number] = [320, 500]

  constructor(public nodes: Phaser.GameObjects.Rectangle[]) {
    const [originX, originY] = this._origin

    nodes.forEach((node, nodeIndex) => {
      node.setPosition(originX + 50 * nodeIndex, originY)
      node.setStrokeStyle(2, 0x0000ff)
      node.setDisplaySize(30, 45)
    })
  }

  clean() {
    this.nodes.forEach((node) => {
      node.setFillStyle(0xfff)
    })
  }

  update(cards: CardDescriptor[]) {
    cards.forEach((card, index) => {
      this.nodes[index].setFillStyle(0x00ff00)
    })
  }
}

export default HandRendererComponent
