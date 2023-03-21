import EntitiesManager from './EntitiesManager'
import type { System, SystemConstructor } from './System'

const MAX_SYSTEMS = 1000
enum SystemManagerStates {
  INIT = 'INIT',
  LOADING = 'LOADING',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

export default class SystemsManager {
  private _state: SystemManagerStates = SystemManagerStates.INIT
  private _systems: System[] = []
  private _systemsOrder: number[] = []
  private _lastKey: number = 0
  private _entitiesManager: EntitiesManager
  private _typesSystemMap: Map<SystemConstructor, number[]> = new Map()

  constructor(
    systems: SystemConstructor[] = [],
    entitiesManager = new EntitiesManager(),
  ) {
    this._entitiesManager = entitiesManager
    this._state = SystemManagerStates.LOADING

    Promise.all(systems.map((s) => this.add(s)))
      .then(() => {
        this._state = SystemManagerStates.RUNNING
      })
      .catch((e) => {
        throw e
      })
  }

  private generateUniqueKey() {
    for (
      let key = this._lastKey + 1;
      key !== this._lastKey;
      key += key >= MAX_SYSTEMS ? -key : 1
    ) {
      if (!this._systems[key]) {
        this._lastKey = key
        return key
      }
    }

    throw new Error('max systems reached!')
  }

  async add(System: SystemConstructor) {
    const key = this.generateUniqueKey()

    this._systems[key] = new System(this._entitiesManager, this)
    this._systemsOrder.push(key)

    await this._systems[key].load?.()

    return key
  }

  remove(key: number) {
    delete this._systems[key]
    this._systemsOrder = this._systemsOrder.filter((k) => k !== key)
  }

  get(key: number): System {
    return this._systems[key]
  }

  getSystemsOfType(System: SystemConstructor): System[] {
    return this._systems.filter((s) => s instanceof System)
  }

  load() {
    this._systemsOrder.forEach((k) => this._systems[k].load?.())
  }

  update(dt: number) {
    this._systemsOrder.forEach((k) => this._systems[k].update?.(dt))
  }

  render(dt: number) {
    this._systemsOrder.forEach((k) => this._systems[k].render?.(dt))
  }
}
