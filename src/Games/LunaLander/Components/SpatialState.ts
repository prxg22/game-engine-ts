import { Component } from '../../../Core'

class SpatialState extends Component {
  constructor(
    public x: number,
    public y: number,
    public dx: number,
    public dy: number
  ) {
    super()
  }
}

export default SpatialState
