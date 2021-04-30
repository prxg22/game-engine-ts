import { Component } from '../../../Core'

export enum CREATURE_STATUS {
  MOVING,
  ATACKING,
  SUMMONING,
}

export default class CreatureAttributes extends Component {
  public status: CREATURE_STATUS = CREATURE_STATUS.SUMMONING

  constructor(public name: string, public speed: number) {
    super()
  }
}
