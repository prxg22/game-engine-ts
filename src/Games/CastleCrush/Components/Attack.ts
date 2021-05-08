import { Component } from '../../../Core'

export interface AttackDescriptor {
  power: number
  range?: number
  spread?: number
  area?: boolean
}

export default class Attack extends Component {
  constructor(
    public power: number = 1,
    public range: number = 1,
    public spread: number = 0,
    public area: boolean = Boolean(spread),
  ) {
    super()
  }
}
