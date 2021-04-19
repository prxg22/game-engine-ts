import { Component } from '../../../Core'

export default class Creature extends Component {
  constructor(public speed: number, public atk: number, public range: number) {
    super()
  }
}
