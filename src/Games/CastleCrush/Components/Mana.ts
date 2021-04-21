import { Component } from '../../../Core'
import { MIN_MANA, MAX_MANA } from '../constants'

export default class Mana extends Component {
  private _current: number
  private _max: number

  constructor(max: number, current: number = 0) {
    super()
    this._current = current >= MIN_MANA ? current : 0
    const newLocal = max >= MIN_MANA
    this._max = newLocal ? current : 0
  }

  get current(): number {
    return this._current
  }

  get max(): number {
    return this._max
  }

  increment(n: number = 1) {
    const value = this._current + Math.max(n, 0)
    this._current = Math.min(value, this._max)
  }

  decrement(n: number = 1) {
    const value = this._current - Math.max(n, 0)
    this._current = Math.max(value, MIN_MANA)
  }

  incrementMax(n: number = 1) {
    const value = this._max + Math.max(n, 0)
    this._max = Math.min(value, MAX_MANA)
  }

  decrementMax(n: number = 1) {
    const value = this._max - Math.max(n, 0)
    this._max = Math.max(value, MIN_MANA)
  }
}
