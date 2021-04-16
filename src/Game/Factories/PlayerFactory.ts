import { Component, Entity, EntityManager } from '../../Core'
import { CardDescriptor } from '../Components/CardDescriptorComponent'
import DeckComponent from '../Components/DeckComponent'
import { PlayerDeckRendererComponent } from '../Components/DeckRendererComponent'
import HandComponent from '../Components/HandComponent'
import HealthComponent from '../Components/HealthComponent'
import ManaComponent from '../Components/ManaComponent'
import * as CardFactory from './CardFactory'

const MAX_MANA = 12
interface PlayerDescription {
  hp: number
  cards: CardDescriptor[]
}

export const create = (
  descriptor: PlayerDescription,
  entityManager: EntityManager,
  deckShape: Phaser.GameObjects.Shape,
  cardShape: Phaser.GameObjects.Shape
) => {
  const { hp, cards: cardsDescriptors } = descriptor

  const player = entityManager.createEntity()
  const addComponent = (component: Component) => {
    entityManager.addComponent(component, player)
  }

  addComponent(new HealthComponent(hp))
  addComponent(new ManaComponent(MAX_MANA))

  const cards = cardsDescriptors.map((cardDescriptor) =>
    CardFactory.create(cardDescriptor, entityManager)
  )

  addComponent(new DeckComponent(cards))
  addComponent(new PlayerDeckRendererComponent(deckShape, cardShape))
  addComponent(new HandComponent())

  return player
}
