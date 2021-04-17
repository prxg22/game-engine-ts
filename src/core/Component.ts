let uid = 0
export default class Component {
  id: number

  constructor() {
    this.id = uid++
  }

  toString() {
    return `${this.id} - ${this.constructor.name}`
  }
}
