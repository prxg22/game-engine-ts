import { Component, Entity } from '../../../Core'

const HAND_MAX_CARD = 5
export default class Hand extends Component {
  constructor(public cards: Entity[] = []) {
    super()
  }

  get full() {
    return this.cards.length >= HAND_MAX_CARD
  }

  add(card: Entity | Entity[]) {
    if (this.full) return
    const cards: Entity[] = typeof card === 'number' ? [card] : card
    this.cards = [...this.cards, ...cards]
  }

  remove(entities: Entity | Entity[]): Entity[] {
    const removedCards: Entity[] = []
    const entitiesToBeRemoved: Entity[] =
      typeof entities === 'number' ? [entities] : entities

    console.log({ entitiesToBeRemoved })
    entitiesToBeRemoved.forEach((card) => {
      const index = this.cards.findIndex((c) => c === card)

      removedCards.push(card)

      this.cards = [
        ...this.cards.slice(0, index),
        ...this.cards.slice(index + 1)
      ]
    })

    return removedCards
  }
}
