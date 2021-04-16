import Phaser from 'phaser'
import { Component } from '../../Core'
import { DECK_STATUS } from './DeckComponent'

abstract class DeckRendererComponent implements Component {
  public deckNode: Phaser.GameObjects.Shape
  public cardNode: Phaser.GameObjects.Shape

  constructor(
    deckNode: Phaser.GameObjects.Shape,
    cardNode: Phaser.GameObjects.Shape
  ) {
    this.deckNode = deckNode
    this.cardNode = cardNode
  }

  abstract renderStatus(status: DECK_STATUS): void
}

export class PlayerDeckRendererComponent extends DeckRendererComponent {
  constructor(
    deckNode: Phaser.GameObjects.Shape,
    cardNode: Phaser.GameObjects.Shape
  ) {
    super(deckNode, cardNode)
    this.deckNode.setDisplaySize(30, 45)
    this.deckNode.setPosition(700, 500)
    this.deckNode.setFillStyle(0x33ff00)
    this.deckNode.setStrokeStyle(2, 0x33ff00)

    // this.cardNode.visible = false
    this.cardNode.setPosition(700, 500)
    this.cardNode.setDisplaySize(30, 45)
    this.cardNode.setFillStyle(0xff3300)
  }

  renderStatus(status: DECK_STATUS) {
    switch (status) {
      case DECK_STATUS.DRAWING_CARD:
        this.cardNode.visible = true
        this.cardNode.setFillStyle(0xffff00)
        this.cardNode.setPosition(this.cardNode.x - 1, this.cardNode.y)
        break
      case DECK_STATUS.DROPPING_CARD:
        this.cardNode.visible = true
        this.cardNode.setFillStyle(0xffff00)
        this.cardNode.setPosition(this.cardNode.x, this.cardNode.y - 1)
        break
      default:
        this.cardNode.visible = false
        this.cardNode.setPosition(this.deckNode.x, this.deckNode.y)
    }
  }
}

export default DeckRendererComponent
