import { Component } from '../../../Core'

class Engine extends Component {
  constructor(public thrust: number, public on: boolean = false) {
    super()
  }
}

export default Engine
