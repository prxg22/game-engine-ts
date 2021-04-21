import Entity from './Entity'
import Component from './Component'

const MAX_ID = 999999

interface IComponent {
  new (...args: any[]): Component
}

class EntityManager {
  private _entitiesMap: Map<Entity, Component[]> = new Map<
    Entity,
    Component[]
  >()
  private _tagsMap: Map<string, Entity> = new Map<string, Entity>()
  private _nextEntity: Entity = 1

  generateUniqueEntity(): Entity {
    if (this._nextEntity < MAX_ID) return ++this._nextEntity

    for (let i = 1; i < MAX_ID; i++) {
      if (!this._entitiesMap.has(i)) return i
    }

    throw Error("can't generate new ids")
  }

  createEntity(tag?: string): Entity {
    const entity = this.generateUniqueEntity()
    if (tag) this._tagsMap.set(tag, entity)
    this._entitiesMap.set(entity, [])
    return entity
  }

  getEntityByTag(tag: string): Entity | undefined {
    return this._tagsMap.get(tag)
  }

  getTagByEntity(entity: Entity): string | undefined {
    for (let [key, value] of this._tagsMap.entries()) {
      if (value === entity) return key
    }
  }

  getComponents(key: Entity | string): Component[] {
    let entity: Entity = key as Entity
    if (typeof key === 'string') entity = this._tagsMap.get(key) as Entity
    if (typeof entity !== 'number') return []

    return this._entitiesMap.get(entity) || []
  }

  addComponent(component: Component, key: Entity | string) {
    let entity: Entity = key as Entity
    if (typeof key === 'string') entity = this._tagsMap.get(key) as Entity
    if (!this._entitiesMap.has(entity)) throw Error('entity not found')

    const components = this._entitiesMap.get(entity) || []
    this._entitiesMap.set(entity, [...components, component])
  }

  getComponentOfClass(
    componentClass: IComponent,
    key: Entity | string,
  ): Component | undefined {
    let entity: Entity = key as Entity
    if (typeof key === 'string') entity = this._tagsMap.get(key) as Entity
    if (!this._entitiesMap.has(entity)) return

    const components = this._entitiesMap.get(entity)

    return components?.find(c => c instanceof componentClass)
  }

  removeEntity(key: Entity | string) {
    let entity: Entity = key as Entity
    if (typeof key === 'string') entity = this._tagsMap.get(key) as Entity
    this._entitiesMap.delete(entity)
  }

  getAllEntitiesPosessingComponentOfClasses(
    componentClasses: IComponent[],
  ): Entity[] {
    const entities = Array.from(this._entitiesMap.keys())

    return entities.reduce((arr: Entity[], e: Entity) => {
      const entityComponents = this.getComponents(e)
      const hasAllComponents = componentClasses.every(componentClass =>
        entityComponents.find(component => component instanceof componentClass),
      )

      if (hasAllComponents) return [...arr, e]
      return arr
    }, [])
  }

  getAllEntities(): Entity[] {
    return Array.from(this._entitiesMap.keys())
  }
}

export default EntityManager
