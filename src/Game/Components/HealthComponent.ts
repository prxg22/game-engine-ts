class HealthComponent {
  private _current

  constructor(public max: number, current: number = max) {
    this._current = current
  }

  set current(n: number) {
    this._current = Math.min(Math.max(n, 0), this.max)
  }

  get current(): number {
    return this._current
  }

  hit(n: number) {
    this.current -= Math.max(n, 0)
  }

  recover(n: number) {
    this.current += Math.max(n, 0)
  }
}

export default HealthComponent
