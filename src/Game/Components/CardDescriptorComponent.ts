import { Component } from '../../Core'

export enum TYPES {
  CREATURE
}

export interface CardDescriptor {
  name: string
  mana: number
  type: TYPES
}

class CardDescriptorComponent implements Component {
  constructor(public descriptor: CardDescriptor) {}
}

export default CardDescriptorComponent
