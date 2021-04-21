import { Entity } from '../../../Core'
import { FRAME_COLOR } from '../../Snake/constants'
import Deck from '../Components/Deck'
import Hand from '../Components/Hand'
import LaneSelection from '../Components/LaneSelection'
import MouseInput from '../Components/MouseInput'
import Renderer from '../Components/Renderer'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HAND_SELECTED_CARD_COLOR,
  PLAYER_HAND_DISPLAY_ORIGIN,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_CARD_SIZE,
  OPPONENT_CARD_SIZE,
  PLAYER_CARD_COLOR,
  OPPONENT_CARD_COLOR,
} from '../constants'
import MainScene from '../Scenes/MainScene'
import BaseSystem from './BaseSystem'
import LaneSelectionSystem from './LaneSelectionSystem'

export default class HandSystem extends BaseSystem {
  // summonCreature(card: Entity, player: Entity): Entity {
  //   const isOpponent = this.entityManager.getEntityByTag('opponent') === player
  //   const creature = this.factory?.creature(
  //     card,
  //     0,
  //     !isOpponent ? 0 : MAX_LANE_POSITION - 1,
  //   )
  //   if (!creature) return -1

  //   const creatureCollection = this.entityManager.getComponentOfClass(
  //     CreatureCollection,
  //     player,
  //   ) as CreatureCollection

  //   if (creature) creatureCollection.entities.push(creature)
  //   return creature
  // }

  // invokeSelctedCard(player: Entity): Entity | undefined {
  //   const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand

  //   const key = this.inputManager.get(player)
  //   this.inputManager.set(player, undefined)

  //   if (!key) return

  //   let card: Entity = -1

  //   const remove = (index: number): Entity[] | undefined => {
  //     if (!hand.cards[index]) return
  //     const cards = hand.remove(hand.cards[index])
  //     this.entityManager.removeEntity(card)
  //     return cards
  //   }

  //   switch (key.keyCode) {
  //     case HAND_ONE_KEY:
  //       ;[card] = remove(0) || []
  //       break
  //     case HAND_TWO_KEY:
  //       ;[card] = remove(1) || []
  //       break
  //     case HAND_THREE_KEY:
  //       ;[card] = remove(2) || []
  //       break
  //     case HAND_FOUR_KEY:
  //       ;[card] = remove(3) || []
  //       break
  //     case HAND_FIVE_KEY:
  //       ;[card] = remove(4) || []
  //       break
  //   }

  //   return card
  // }

  draw(entity: Entity, deck: Deck, hand: Hand) {
    if (!deck.drawList.length || hand.full) return

    deck.drawList.forEach(cardName => {
      const card = this.factory?.card(cardName, entity, hand.cards.length)
      hand.add(card || -1)
    })
  }

  selectCardIfWasClicked(hand: Hand) {
    // percorre a mão procurando por cartas que tenham sido clicadas
    // e as seleciona

    hand.cards.forEach(card => {
      const mouse = this.entityManager.getComponentOfClass(
        MouseInput,
        card,
      ) as MouseInput

      if (!mouse || mouse.x < 0 || mouse.y < 0) return
      LaneSelectionSystem.refreshLaneSelection()
      hand.selected = card
    })
  }

  update() {
    const handEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand],
    )

    handEntities.forEach(entity => {
      const isPlayer = entity === this.entityManager.getEntityByTag('player')
      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck

      if (isPlayer)
        MainScene.instance().debugEntities(
          this.entityManager.getEntityByTag('player') || -1,
          ...hand.cards,
        )

      // checa o mouse e marca as cartas selecionadas
      if (hand && isPlayer) this.selectCardIfWasClicked(hand)
      if (deck) this.draw(entity, deck, hand)
    })
  }

  render() {
    const handEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand],
    )

    handEntities.forEach(entity => {
      const isPlayer = entity === this.entityManager.getEntityByTag('player')

      const playerHand = this.entityManager.getComponentOfClass(
        Hand,
        entity,
      ) as Hand

      playerHand.cards.forEach((card, index) => {
        const renderer = this.entityManager.getComponentOfClass(
          Renderer,
          card,
        ) as Renderer<Phaser.GameObjects.Shape>

        const displayOrigin = isPlayer
          ? PLAYER_HAND_DISPLAY_ORIGIN
          : OPPONENT_HAND_DISPLAY_ORIGIN
        const cardSize = isPlayer ? PLAYER_CARD_SIZE : OPPONENT_CARD_SIZE
        const color = isPlayer ? PLAYER_CARD_COLOR : OPPONENT_CARD_COLOR

        const [handOriginX, handOriginY] = displayOrigin
        const [width] = cardSize

        renderer.sprite.setPosition(
          index * width * 2 + handOriginX,
          handOriginY,
        )

        if (playerHand.selected === card)
          renderer.sprite.setFillStyle(HAND_SELECTED_CARD_COLOR)
        else renderer.sprite.setFillStyle(color)
      })
    })
  }
}
