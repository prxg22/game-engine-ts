import Entity from "./Entity"
import Component from "./Component"

const MAX_ID = 999999

class EntityManager {
  private _entitiesMap: Map<Entity, Component[]> = new Map()
  private _nextEntity: Entity = 1

  generateUniqueEntity(): Entity {
    if (this._nextEntity < MAX_ID) return this._nextEntity++

    for (let i = 1; i < MAX_ID; i++) {
      if (!this._entitiesMap.has(i)) return i
    }

    throw Error("can't generate new ids")
  }

  createEntity(): Entity {
    const entity = this.generateUniqueEntity()
    this._entitiesMap.set(entity, [])
    return entity
  }

  addComponent(component: Component, entity: Entity) {
    if (!this._entitiesMap.has(entity)) throw Error("entity not found")

    const components = <Component[]>this._entitiesMap.get(entity)
    this._entitiesMap.set(entity, [...components, component])
  }

  getComponentOfClass(
    componentClass: typeof Component,
    entity: Entity
  ): Component | undefined {
    if (!this._entitiesMap.has(entity)) throw Error("entity not found")

    const components = this._entitiesMap.get(entity)

    return components?.find((c) => c instanceof componentClass)
  }

  removeEntity(entity: Entity) {
    this._entitiesMap.delete(entity)
  }

  getAllEntitiesPosessingComponentOfClass(
    componentClass: typeof Component
  ): Entity[] {
    const entities = Array.from(this._entitiesMap.keys())

    return entities.reduce((arr: Entity[], e: Entity) => {
      const component = this.getComponentOfClass(componentClass, e)

      if (component) return [...arr, e]
      return arr
    }, [])
  }
}

export default EntityManager
