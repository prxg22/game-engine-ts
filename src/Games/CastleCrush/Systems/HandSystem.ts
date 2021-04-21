import { Entity, System } from '../../../Core'
import { FRAME_COLOR } from '../../Snake/constants'
import Deck from '../Components/Deck'
import Hand from '../Components/Hand'
import MouseInput from '../Components/MouseInput'
import Renderer from '../Components/Renderer'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HAND_SELECTED_CARD_COLOR,
  TICK,
  PLAYER_HAND_DISPLAY_ORIGIN,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_CARD_SIZE,
  OPPONENT_CARD_SIZE,
  PLAYER_CARD_COLOR,
  OPPONENT_CARD_COLOR,
  PLAYER_HAND_POSITION_NAME_0,
  PLAYER_HAND_POSITION_NAME_1,
  PLAYER_HAND_POSITION_NAME_2,
  PLAYER_HAND_POSITION_NAME_3,
  PLAYER_HAND_POSITION_NAME_4,
} from '../constants'
import Factory from '../Factory'
import BaseSystem from './BaseSystem'

export default class HandSystem extends BaseSystem {
  inputManager: Map<Entity, Phaser.Input.Keyboard.Key | undefined> = new Map()

  create() {
    super.create()
    const frame = this.gameObjectFactory.rectangle(
      8,
      8,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
    )
    frame.setDisplayOrigin(0, 0)
    frame.setStrokeStyle(8, FRAME_COLOR)
  }

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

    deck.drawList.forEach(card => {
      const creature = this.factory?.card(card, entity, hand.cards.length)
      hand.add(creature || -1)
    })
  }

  checkIfCardWasSelected(mouseInput: MouseInput, hand: Hand) {
    const responsePositions = mouseInput.flush()

    // verifica se um clique aconteceu em alguma carta na mão da entidade
    // e a marca como selecionada
    Object.keys(responsePositions).forEach(name => {
      switch (name) {
        case PLAYER_HAND_POSITION_NAME_0:
          hand.selected = hand.cards[0]
          break
        case PLAYER_HAND_POSITION_NAME_1:
          hand.selected = hand.cards[1]
          break
        case PLAYER_HAND_POSITION_NAME_2:
          hand.selected = hand.cards[2]
          break
        case PLAYER_HAND_POSITION_NAME_3:
          hand.selected = hand.cards[3]
          break
        case PLAYER_HAND_POSITION_NAME_4:
          hand.selected = hand.cards[4]
          break
      }
    })
  }

  update() {
    const handEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Hand],
    )

    handEntities.forEach(entity => {
      const hand = this.entityManager.getComponentOfClass(Hand, entity) as Hand
      const mouseInput = this.entityManager.getComponentOfClass(
        MouseInput,
        entity,
      ) as MouseInput
      const deck = this.entityManager.getComponentOfClass(Deck, entity) as Deck

      // checa o input e marca as cartas selecionadas
      if (mouseInput) this.checkIfCardWasSelected(mouseInput, hand)
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
