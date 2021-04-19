import { Component } from '../../../Core'

export default class LanePosition extends Component {
  constructor(public lane: number, public position: number = 0) {
    super()
  }
}
