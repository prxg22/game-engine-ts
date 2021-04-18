import { Component, Entity } from '../../../Core'

export default class EntityCollection extends Component {
  constructor(public entities: Entity[] = []) {
    super()
  }
}
