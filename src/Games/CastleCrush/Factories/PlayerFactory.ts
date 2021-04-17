import { Component, Entity, EntityManager } from '../../../Core'
import { CardDescriptor } from '../Components/CardDescriptorComponent'
import DeckComponent from '../Components/DeckComponent'
import { PlayerDeckRendererComponent } from '../Components/DeckRendererComponent'
import HandComponent from '../Components/HandComponent'
import HandRendererComponent from '../Components/HandRendererComponent'
import HealthComponent from '../Components/HealthComponent'
import ManaComponent from '../Components/ManaComponent'
import ManaRendererComponent from '../Components/ManaRendererComponent'
import * as CardFactory from './CardFactory'

const MAX_MANA = 12
interface PlayerDescription {
  hp: number
  cards: CardDescriptor[]
}

export const create = (
  descriptor: PlayerDescription,
  entityManager: EntityManager,
  scene: Phaser.Scene
) => {
  const { hp, cards: cardsDescriptors } = descriptor

  const player = entityManager.createEntity()
  const addComponent = (component: Component) => {
    entityManager.addComponent(component, player)
  }

  const cards = cardsDescriptors.map((cardDescriptor) =>
    CardFactory.create(cardDescriptor, entityManager)
  )

  addComponent(new HealthComponent(hp))
  addComponent(new ManaComponent(MAX_MANA))
  addComponent(new HandComponent())
  addComponent(new DeckComponent(cards))
  // addComponent(
  //   new PlayerDeckRendererComponent(
  //     scene.add.rectangle(),
  //     scene.add.rectangle()
  //   )
  // )
  // addComponent(new ManaRendererComponent(scene.add.text(0, 0, '')))
  // addComponent(
  //   new HandRendererComponent([
  //     scene.add.rectangle(),
  //     scene.add.rectangle(),
  //     scene.add.rectangle(),
  //     scene.add.rectangle(),
  //     scene.add.rectangle()
  //   ])
  // )

  return player
}
