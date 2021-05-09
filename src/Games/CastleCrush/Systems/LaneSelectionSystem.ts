import { GameObjects } from 'phaser'
import { Entity, EntityManager, System } from '../../../Core'
import MainScene from '../../LunaLander/Scenes/MainScene'
import { LANE_SELECT_COLOR } from '../../Snake/constants'
import CardDescriptor from '../Components/CardDescriptor'
import Hand from '../Components/Hand'
import LanePosition, { LaneReference } from '../Components/LanePosition'
import LaneSelection, {
  LANE_SELECTION_STATUS,
} from '../Components/LaneSelection'
import Mana from '../Components/Mana'
import MouseInput from '../Components/MouseInput'
import {
  CREATURE_SIZE,
  LANES,
  LANE_DISPLAY_ORIGIN,
  LANE_DISPLAY_SIZE,
  LANE_MARGIN_SIZE,
  LANE_SIZE,
  P1_TAG,
} from '../constants'
import BaseSystem from '../Core/BaseSystem'
import LaneMovementSystem from './LaneMovementSystem'

let msg = ''
export default class LaneSelectionSystem extends BaseSystem {
  constructor(
    entityManager: EntityManager,
    gameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    inputPlugin: Phaser.Input.InputPlugin,
  ) {
    super(entityManager, gameObjectFactory, inputPlugin)
  }

  getMaxValidPosition(player: Entity, lane: number) {
    const furthestPlayerCreature = this.entityManager.getPlayerFurthestCreature(
      player,
    )
    const furthestOpponentCreatureOnLane = this.entityManager.getPlayerFurthestCreatureOnLane(
      this.entityManager.getOpponent(player),
      lane,
    )

    const furthestPlayerCreaturePosition =
      (this.entityManager.getComponentOfClass(
        LanePosition,
        furthestPlayerCreature,
      ) as LanePosition)?.position || 1
    const furthestOpponentCreaturePosition =
      (this.entityManager.getComponentOfClass(
        LanePosition,
        furthestOpponentCreatureOnLane,
      ) as LanePosition)?.position || 1

    return Math.min(
      furthestPlayerCreaturePosition,
      LANE_SIZE / 2,
      LANE_SIZE - furthestOpponentCreaturePosition,
    )
  }

  isValidLaneReference(player: Entity, laneReference: LaneReference): boolean {
    return (
      laneReference.position <=
      this.getMaxValidPosition(player, laneReference.lane)
    )
  }

  selectLane(player: Entity, laneReference: LaneReference) {
    const laneSelection = this.entityManager.getComponentOfClass(
      LaneSelection,
      player,
    ) as LaneSelection
    if (!laneSelection) return

    laneSelection.lane = laneReference.lane
    laneSelection.position = laneReference.position
    laneSelection.status = LANE_SELECTION_STATUS.SET
  }

  checkIfPlayerHasEnoughMana(player: Entity, selectedCard: Entity): boolean {
    const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana
    const descriptor = this.entityManager.getComponentOfClass(
      CardDescriptor,
      selectedCard,
    ) as CardDescriptor

    if (!mana || !descriptor) return false
    return mana.current >= descriptor.manaCost
  }

  getSelectedCardFromHand(player: Entity): Entity | undefined {
    const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand

    if (!hand) return

    return hand.selected
  }

  getLaneReferenceIfItWasClicked(): LaneReference | undefined {
    for (let lane = 0; lane < LANES; lane++) {
      const mouse = this.entityManager.getComponentOfClass(
        MouseInput,
        `lane-${lane}`,
      ) as MouseInput
      const [baseWidth] = LANE_DISPLAY_SIZE
      if (mouse.x < 0 && mouse.y < 0) continue
      return {
        lane,
        position: Math.round((mouse.x * LANE_SIZE) / baseWidth),
      }
    }
  }

  static refreshLaneSelection(laneSelection?: LaneSelection) {
    if (!laneSelection) return
    laneSelection.status = LANE_SELECTION_STATUS.DEFAULT
    laneSelection.lane = -1
    laneSelection.position = -1
  }

  update(dt: number) {
    const player1 = this.entityManager.player1 || -1

    const laneSelection = this.entityManager.getComponentOfClass(
      LaneSelection,
      player1,
    ) as LaneSelection

    // msg = `status: ${LANE_SELECTION_STATUS[laneSelection.status]}\n`

    // refresh lane selection
    // LaneSelectionSystem.refreshLaneSelection(laneSelection)
    // checa se houve clique em alguma lane e retorna referencia da lane
    const laneReference = this.getLaneReferenceIfItWasClicked()
    if (!laneReference) return

    // checa se a laneReference é válida para esta carta
    if (!this.isValidLaneReference(player1, laneReference)) {
      laneSelection.status = LANE_SELECTION_STATUS.INVALID_LANE_REFERENCE
      return
    }

    // verifica se naquela entidade tem uma carta selcionada na mao
    const selectedCard = this.getSelectedCardFromHand(player1)
    if ((selectedCard || -1) < 0) {
      laneSelection.status = LANE_SELECTION_STATUS.NO_CARD_SELECTED_ERROR
      return
    }

    // verificar se a entidade tem mana suficiente
    const hasEnoughMana = this.checkIfPlayerHasEnoughMana(
      player1,
      selectedCard || -1,
    )

    if (!hasEnoughMana) {
      laneSelection.status = LANE_SELECTION_STATUS.NO_CARD_SELECTED_ERROR
      return
    }
    // seleciona a lane no componente LanseSelection
    this.selectLane(player1, laneReference)
  }

  /// will be removed
  laneSelectionShapes: GameObjects.Shape[] = []
  render() {
    const player1 = this.entityManager.player1
    const hand = this.entityManager.getComponentOfClass(Hand, player1) as Hand

    // MainScene.instance.debug(msg)
    this.laneSelectionShapes.forEach(s => s.setVisible(hand.selected > -1))
    if (!hand.selected) return

    for (let lane = 0; lane < LANES; lane++) {
      const [, baseHeight] = LANE_DISPLAY_SIZE
      const [baseX] = LANE_DISPLAY_ORIGIN
      const position = this.getMaxValidPosition(player1, lane)
      const [maxX, maxY] = LaneMovementSystem.calculateDisplayPosition(
        { id: -1, lane, position },
        true,
      ) || [-1, -1]

      if (!this.laneSelectionShapes[lane])
        this.laneSelectionShapes[lane] = this.gameObjectFactory
          .rectangle(
            baseX,
            maxY - CREATURE_SIZE - 7,
            maxX - CREATURE_SIZE,
            baseHeight,
            LANE_SELECT_COLOR,
            0.8,
          )
          .setDisplayOrigin(0, 0)

      this.laneSelectionShapes[lane].setDisplaySize(
        maxX - CREATURE_SIZE * 2,
        baseHeight,
      )
    }
  }
}
