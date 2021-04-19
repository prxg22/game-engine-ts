import { Component } from '../../../Core'

export enum CARD_TYPE {
  MAGIC,
  CREATURE
}
export default class CardDescriptor extends Component {
  constructor(
    public name: string,
    public type: CARD_TYPE,
    public mana: number
  ) {
    super()
  }
}
