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
  SELECTED_CARD_COLOR,
  P1_HAND_DISPLAY_ORIGIN,
  P2_HAND_DISPLAY_ORIGIN,
  P1_CARD_SIZE,
  P2_CARD_SIZE,
  FRONTCOVER_CARD_COLOR,
  BACKCOVER_CARD_COLOR,
  P1_TAG,
} from '../constants'
import MainScene from '../Scenes/MainScene'
import BaseSystem from '../Core/BaseSystem'
import LaneSelectionSystem from './LaneSelectionSystem'
import { GameObjects } from 'phaser'
import CardDescriptor from '../Components/CardDescriptor'
import Mana from '../Components/Mana'

export default class HandSystem extends BaseSystem {
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

      if (!mouse || mouse.x < 0 || mouse.y < 0 || card === hand.selected) return

      // refresh LaneSelection every time hand.selected changes
      // to avoid other creatures being summoned on previously selected lanes
      const player = this.entityManager.getEntityPosessingComponentOfId(hand.id)
      const laneSelection = this.entityManager.getComponentOfClass(
        LaneSelection,
        player || -1,
      ) as LaneSelection

      LaneSelectionSystem.refreshLaneSelection(laneSelection)
      hand.selected = card
    })
  }

  update() {
    const handEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand],
    )

    handEntities.forEach(player => {
      const isPlayer1 = this.entityManager.isPlayer1(player)
      const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand
      const deck = this.entityManager.getComponentOfClass(Deck, player) as Deck

      // checa o mouse e marca as cartas selecionadas
      if (hand && isPlayer1) this.selectCardIfWasClicked(hand)
      if (deck) this.draw(player, deck, hand)
    })
  }

  descriptions: GameObjects.Text[] = []
  render() {
    const handEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand],
    )
    this.descriptions.forEach(m => m.setVisible(false))

    handEntities.forEach(entity => {
      const isPlayer1 = this.entityManager.isPlayer1(entity)

      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand

      hand.cards.forEach((card, index) => {
        const cardDescriptor = this.entityManager.getComponentOfClass(
          CardDescriptor,
          card,
        ) as CardDescriptor
        const renderer = this.entityManager.getComponentOfClass(
          Renderer,
          card,
        ) as Renderer<Phaser.GameObjects.Shape>
        const displayOrigin = isPlayer1
          ? P1_HAND_DISPLAY_ORIGIN
          : P2_HAND_DISPLAY_ORIGIN
        const cardSize = isPlayer1 ? P1_CARD_SIZE : P2_CARD_SIZE
        const color = isPlayer1 ? FRONTCOVER_CARD_COLOR : BACKCOVER_CARD_COLOR

        const [handOriginX, handOriginY] = displayOrigin
        const [width, height] = cardSize
        const x = index * width * 2 + handOriginX

        renderer.sprite.setPosition(x, handOriginY)

        if (hand.selected === card)
          renderer.sprite.setFillStyle(SELECTED_CARD_COLOR)
        else renderer.sprite.setFillStyle(color)

        if (!isPlayer1) return
        const mana = this.entityManager.getComponentOfClass(
          Mana,
          entity,
        ) as Mana
        renderer.sprite.setAlpha(
          1 + (mana.current - cardDescriptor.manaCost) * 0.3,
        )

        this.descriptions[cardDescriptor.id] = (
          this.descriptions[cardDescriptor.id] ||
          this.gameObjectFactory.text(0, 0, '', { fontSize: '10px' })
        )
          .setText(`${cardDescriptor.name}\n${cardDescriptor.manaCost}`)
          .setPosition(x - width / 2, handOriginY + height)
          .setVisible(true)
      })
    })
  }
}
