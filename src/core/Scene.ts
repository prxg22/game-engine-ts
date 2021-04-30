import Phaser from 'phaser'
import Component from './Component'
import Entity from './Entity'
import EntityManager from './EntityManager'
import System from './System'

abstract class Scene extends Phaser.Scene {
  entityManager: EntityManager
  systems: System[] = []
  text?: Phaser.GameObjects.Text
  debugPosition: number[] = [0, 0]
  static instance: Scene

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    this.entityManager = new EntityManager()
    Scene.instance = this
  }

  create() {
    const [debugX, debugY] = this.debugPosition
    this.text = this.add.text(debugX, debugY, '')
    this.systems.forEach(s => s.create())
  }

  update(time?: number, dt?: number) {
    this.systems.forEach(s => {
      s.update(dt)
    })
    this.systems.forEach(s => {
      s.render(dt)
    })
  }

  setTextPosition(x: number = 0, y: number = 0) {
    this.text?.setPosition(x, y)
  }

  debugEntities(entities: (Entity | string)[], position?: number[]): string {
    if (position && position.length)
      this.setTextPosition(position[0], position[1])
    const msg = (entities.length
      ? entities
      : this.entityManager.getAllEntities()
    )
      .map(entityOrTag => {
        const isTag = typeof entityOrTag === 'string'
        const entity = (isTag
          ? this.entityManager.getEntityByTag(entityOrTag as string)
          : entityOrTag) as Entity
        const tag = (isTag
          ? entityOrTag
          : this.entityManager.getTagByEntity(entityOrTag as Entity)) as string
        let msg = `--${tag || entity}--\n`
        msg += this.debugEntity(entity)
        return msg
      })
      .join('\n\n---------\n\n')
    this.text?.setText(msg)
    return msg
  }

  debugEntity(entity: Entity, position?: number[]): string {
    if (position && position.length)
      this.setTextPosition(position[0], position[1])
    const msg = this.entityManager
      .getComponents(entity)
      .map(component => this.debugComponent(component))
      .join('\n')

    this.text?.setText(msg)
    return msg
  }

  debugComponent(component?: Component, position?: number[]): string {
    if (!component) return ''
    if (position && position.length)
      this.setTextPosition(position[0], position[1])
    let msg = `${component.toString()}: `

    msg += Object.entries(component)
      .map(([key, value]): string => {
        return ` ${key}: ${value}`
      })
      .join('\n')

    this?.text?.setText(msg)
    return msg
  }

  debug(msg: any, position?: number[]): string[] {
    this?.text?.setText(msg)
    if (position && position.length)
      this.setTextPosition(position[0], position[1])

    return msg
  }
}

export default Scene
