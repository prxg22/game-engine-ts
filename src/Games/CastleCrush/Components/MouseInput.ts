import { Component } from '../../../Core'

export default class MouseInput extends Component {
  x: number = -1
  y: number = -1

  click(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
