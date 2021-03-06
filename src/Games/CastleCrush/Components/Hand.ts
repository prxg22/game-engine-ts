import { MAX_CARDS } from '../constants'
import { Component, Entity } from '../../../Core'

export default class Hand extends Component {
  selected: Entity = -1

  constructor(public cards: Entity[] = []) {
    super()
  }

  get full() {
    return this.cards.length >= MAX_CARDS
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

    entitiesToBeRemoved.forEach(card => {
      const index = this.cards.findIndex(c => c === card)

      if (this.selected === card) this.selected = -1
      removedCards.push(card)

      this.cards = [
        ...this.cards.slice(0, index),
        ...this.cards.slice(index + 1),
      ]
    })

    return removedCards
  }
}
