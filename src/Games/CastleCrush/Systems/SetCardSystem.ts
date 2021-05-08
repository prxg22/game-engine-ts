import { GameObjects } from 'phaser'
import { Entity } from '../../../Core'
import MainScene from '../../CastleCrush/Scenes/MainScene'
import CardDescriptor from '../Components/CardDescriptor'
import CreatureCollection from '../Components/CreatureCollection'
import Hand from '../Components/Hand'
import { LaneReference } from '../Components/LanePosition'
import LaneSelection from '../Components/LaneSelection'
import Mana from '../Components/Mana'
import Renderer from '../Components/Renderer'
import BaseSystem from '../Core/BaseSystem'

export interface CardToBeSet {
  card: Entity
  laneReference: LaneReference
}

export default class SetCardSystem extends BaseSystem {
  checkLaneAndHandSelection(player: Entity): CardToBeSet | undefined {
    const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand
    const laneSelection = this.entityManager.getComponentOfClass(
      LaneSelection,
      player,
    ) as LaneSelection

    // MainScene.instance.debugEntities(player, ...hand.cards)

    if (!hand || !hand.selected || !laneSelection || laneSelection.lane < 0)
      return
    return { card: hand.selected, laneReference: laneSelection }
  }

  summonCreature(player: Entity, card: Entity, laneReference: LaneReference) {
    const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand
    const renderer = this.entityManager.getComponentOfClass(
      Renderer,
      card,
    ) as Renderer<GameObjects.Shape>

    const creatureCollection = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player,
    ) as CreatureCollection

    const selected = hand.selected
    renderer.sprite.setVisible(false)
    renderer.sprite.destroy()
    hand.remove(card)
    const creature = this.factory?.creature(
      player,
      card,
      laneReference.lane,
      laneReference.position,
    )
    if (!creature || !creatureCollection) return
    creatureCollection.entities.push(creature || -1)
    this.entityManager.removeEntity(selected)
  }

  useManaToSetCard(player: Entity, card: Entity) {
    const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      card,
    ) as CardDescriptor
    if (!mana) return

    mana.decrement(descriptor.manaCost)
  }

  update() {
    const laneSelectionAndHandEntitites = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand, LaneSelection],
    )

    laneSelectionAndHandEntitites.forEach(entity => {
      // checar se há um lane e um uma carta selcionada
      const { card, laneReference } =
        this.checkLaneAndHandSelection(entity) || {}

      if (!card || card < 0 || !laneReference || laneReference.lane < 0) return

      // decrementa mana pelo custo de mana da carta
      this.useManaToSetCard(entity, card || -1)
      // summon creature
      this.summonCreature(entity, card || -1, laneReference)

      // TODO: checa o tipo da carta
      // TODO: set em spell
    })
  }
}
