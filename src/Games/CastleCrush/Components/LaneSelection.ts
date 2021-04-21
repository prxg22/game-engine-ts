import { Component } from '../../../Core'
import { LaneReference } from './LanePosition'

export enum LANE_SELECTION_STATUS {
  DEFAULT,
  SET,
  NO_CARD_SELECTED_ERROR,
  NOT_ENOUGH_MANA_ERROR,
}

export default class LaneSelection extends Component implements LaneReference {
  status: LANE_SELECTION_STATUS = LANE_SELECTION_STATUS.DEFAULT

  constructor(public lane = -1, public position = -1) {
    super()
  }

  setPosition(lane: number = this.lane, position: number = this.position) {
    this.lane = lane
    this.position = position
  }
}
