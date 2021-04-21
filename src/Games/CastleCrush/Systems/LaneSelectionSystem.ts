// import { Entity, System } from '../../../Core'
// import CardDescriptor from '../Components/CardDescriptor'
// import Hand from '../Components/Hand'
// import { LaneReference } from '../Components/LanePosition'
// import LaneSelection from '../Components/LaneSelection'
// import Mana from '../Components/Mana'
// import MouseInput from '../Components/MouseInput'
// import {
//   LANE_POSITION_NAME_0,
//   LANE_POSITION_NAME_1,
//   LANE_POSITION_NAME_2,
// } from '../constants'

// export default class LaneSelectionSystem extends System {
//   selectLane(player: Entity, laneReference: LaneReference) {
//     const laneSelection = this.entityManager.getComponentOfClass(
//       LaneSelection,
//       player,
//     ) as LaneSelection
//     if (!laneSelection) return

//     laneSelection.lane = laneReference.lane
//     laneSelection.position = laneReference.position
//   }

//   checkIfPlayerHasEnoughMana(player: Entity, selectedCard: Entity): boolean {
//     const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana
//     const descriptor = this.entityManager.getComponentOfClass(
//       CardDescriptor,
//       selectedCard,
//     ) as CardDescriptor

//     if (!mana || !descriptor) return false
//     return mana.current >= descriptor.mana
//   }

//   getSelectedCardFromHand(player: Entity): Entity | undefined {
//     const hand = this.entityManager.getComponentOfClass(Hand, player) as Hand

//     if (!hand) return

//     return hand.selected
//   }

//   refreshLaneSelection(player: Entity) {
//     const laneSelection = this.entityManager.getComponentOfClass(
//       LaneSelection,
//       player,
//     ) as LaneSelection

//     if (!laneSelection) return

//     laneSelection.lane = -1
//     laneSelection.position = -1
//   }

//   checkIfLaneWasClicked(player: Entity): LaneReference | undefined {
//     const input = this.entityManager.getComponentOfClass(
//       MouseInput,
//       player,
//     ) as MouseInput

//     if (!input) return

//     const responsePositions = input.flush()
//     const lanePositionsNames = [
//       LANE_POSITION_NAME_0,
//       LANE_POSITION_NAME_1,
//       LANE_POSITION_NAME_2,
//     ]

//     const [laneName, position] =
//       Object.entries(responsePositions).find(([name]) =>
//         lanePositionsNames.includes(name),
//       ) || []

//     if (!laneName || !position) return

//     const [x, y] = position

//     return this.getLanePositionFromScreen(
//       lanePositionsNames.indexOf(laneName),
//       x,
//       y,
//     )
//   }

//   update(dt: number) {
//     const inputEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
//       [MouseInput, Hand, Mana, LaneSelection],
//     )

//     inputEntities.forEach(entity => {
//       // refresh lane selection
//       this.refreshLaneSelection(entity)

//       // checa se houve clique em alguma lane e retorna referencia da lane
//       const laneReference = this.checkIfLaneWasClicked(entity)
//       if (!laneReference) return

//       // TODO: checa se a laneReference é válida para esta carta

//       // verifica se naquela entidade tem uma carta selcionada na mao
//       const selectedCard = this.getSelectedCardFromHand(entity)
//       if (!selectedCard) return

//       // verificar se a entidade tem mana suficiente
//       const hasEnoughMana = this.checkIfPlayerHasEnoughMana(
//         entity,
//         selectedCard,
//       )

//       // seleciona a lane no componente LanseSelection
//       this.selectLane(entity, laneReference)
//     })
//   }

//   private getLanePositionFromScreen(
//     lane: number,
//     screeX: number,
//     screenY: number,
//   ): LaneReference {
//     return { lane: 0, position: 0 }
//   }
// }
