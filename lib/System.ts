import type EntitiesManager from './EntitiesManager'
import type SystemsManager from './SystemsManager'

export interface SystemConstructor {
  new (entitiesManager: EntitiesManager, systemsManager: SystemsManager): System
}

export interface System {
  load?(): void | Promise<void>
  update?(dt?: number): void
  render?(dt?: number): void
}
