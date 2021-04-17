import { Component, Entity } from '../../../Core'

const HAND_MAX_CARD = 5
class HandComponent implements Component {
  constructor(public cards: Entity[] = []) {}

  get full() {
    return this.cards.length >= HAND_MAX_CARD
  }

  addCards(c: Entity | Entity[]) {
    if (this.full) return
    const cards: Entity[] = typeof c === 'number' ? [c] : c

    const diff = Math.max(this.cards.length + cards.length - HAND_MAX_CARD, 0)
    if (diff) {
      const firstCards = [...Array(diff).keys()]
      this.removeCards(firstCards)
    }
    this.cards = [...this.cards, ...cards]
  }

  removeCards(indexes: number | number[]): Entity[] {
    const removedCards: Entity[] = []
    const indexesToBeRemoved: Entity[] =
      typeof indexes === 'number' ? [indexes] : indexes

    indexesToBeRemoved.forEach((index) => {
      removedCards.push(this.cards[index])

      this.cards = [
        ...this.cards.slice(0, index),
        ...this.cards.slice(index + 1)
      ]
    })

    return removedCards
  }
}

export default HandComponent
