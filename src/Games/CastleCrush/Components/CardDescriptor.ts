import { Component } from '../../../Core'

export enum CARD_TYPE {
  MAGIC,
  CREATURE,
}
export default class CardDescriptor extends Component {
  constructor(
    public name: string,
    public mana: number,
    public type: CARD_TYPE,
  ) {
    super()
  }
}
