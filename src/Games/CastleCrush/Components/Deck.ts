import { Component, Entity } from '../../../Core'

export default class Deck extends Component {
  private current: number = 0
  private _cards: string[]
  public drawList: string[] = []

  constructor(cards: string[]) {
    super()
    this._cards = cards
  }

  get cards(): string[] {
    return this._cards.slice(this.current)
  }

  get length() {
    return this._cards.length - this.current
  }

  draw(n: number = 1): string[] {
    let draw = this._cards.slice(this.current, this.current + n)
    this.current += Math.max(n, 0)
    this.drawList = []
    if (this.current >= this._cards.length) {
      const diff = this.current - this._cards.length
      this.current = 0
      draw = [...draw, ...this.draw(diff)]
    }
    this.drawList = draw
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
