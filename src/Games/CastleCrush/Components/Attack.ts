import { Component } from '../../../Core'

export interface AttackDescriptor {
  power: number
  range?: number
  spread?: boolean
  area?: boolean
}

export default class Attack extends Component {
  constructor(
    public power: number = 1,
    public range: number = 1,
    public spread: boolean = false,
    public area: boolean = spread,
  ) {
    super()
  }
}
