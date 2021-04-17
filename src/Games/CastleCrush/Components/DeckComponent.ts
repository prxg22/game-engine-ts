import { Component, Entity } from '../../../Core'

export enum DECK_STATUS {
  INITIAL,
  DRAWING_CARD,
  DROPPING_CARD
}

class DeckComponent implements Component {
  status: DECK_STATUS
  private current: number = 0
  private _cards: Entity[]

  constructor(cards: Entity[]) {
    this._cards = cards
    this.status = DECK_STATUS.INITIAL
  }

  get cards(): Entity[] {
    return this._cards.slice(this.current)
  }
  get length() {
    return this._cards.length - this.current
  }

  draw(n: number = 1): Entity[] {
    let draw = this._cards.slice(this.current, this.current + n)
    this.current += Math.max(n, 0)

    if (this.current >= this._cards.length) {
      const diff = this.current - this._cards.length
      this.current = 0
      draw = [...draw, ...this.draw(diff)]
    }

    return draw
  }

  shuffle() {
    this.current = 0
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = this._cards[i]
      this._cards[i] = this._cards[j]
      this._cards[j] = temp
    }
  }
}

export default DeckComponent
