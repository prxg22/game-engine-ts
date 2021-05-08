import { Entity, EntityManager, System } from '../../../Core'
import CardDescriptor from '../Components/CardDescriptor'
import Hand from '../Components/Hand'
import { LaneReference } from '../Components/LanePosition'
import LaneSelection, {
  LANE_SELECTION_STATUS,
} from '../Components/LaneSelection'
import Mana from '../Components/Mana'
import MouseInput from '../Components/MouseInput'
import { LANES, LANE_DISPLAY_SIZE, LANE_SIZE, P1_TAG } from '../constants'
import BaseSystem from '../Core/BaseSystem'

export default class LaneSelectionSystem extends BaseSystem {
  constructor(
    entityManager: EntityManager,
    gameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    inputPlugin: Phaser.Input.InputPlugin,
  ) {
    super(entityManager, gameObjectFactory, inputPlugin)
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

    // refresh lane selection
    // LaneSelectionSystem.refreshLaneSelection(laneSelection)
    // checa se houve clique em alguma lane e retorna referencia da lane
    const laneReference = this.getLaneReferenceIfItWasClicked()
    if (!laneReference) return

    // TODO: checa se a laneReference é válida para esta carta

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
}
