import { Component, Entity } from '../../../Core'

export default class CreatureCollection extends Component {
  entities: Entity[] = []

  remove(entity: Entity) {
    const index = this.entities.indexOf(entity)

    if (index < 0) return

    this.entities = [
      ...this.entities.slice(0, index),
      ...this.entities.slice(index + 1),
    ]
  }
}
