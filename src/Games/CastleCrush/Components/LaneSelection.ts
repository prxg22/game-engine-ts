import { Component } from '../../../Core'
import { LaneReference } from './LanePosition'

export default class LaneSelection extends Component implements LaneReference {
  constructor(public lane = -1, public position = -1) {
    super()
  }

  setPosition(lane: number = this.lane, position: number = this.position) {
    this.lane = lane
    this.position = position
  }
}
