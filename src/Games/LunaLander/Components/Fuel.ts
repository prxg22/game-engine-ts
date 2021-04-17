import { Component } from '../../../Core'

class Fuel extends Component {
  constructor(public remaining: number) {
    super()
  }

  burn(qty: number) {
    this.remaining -= qty

    if (this.remaining < 0) this.remaining = 0
  }
}

export default Fuel
