import { Component } from '../../../Core'

export interface LaneReference {
  lane: number
  position: number
}

export default class LanePosition extends Component implements LaneReference {
  constructor(public lane: number, public position: number = 0) {
    super()
  }
}
