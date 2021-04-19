import { GameObjects } from 'phaser'
import { Component, Entity, Scene } from '../../../Core'
import CreatureCollection from '../Components/CreatureCollection'
import Renderer from '../Components/Renderer'
import { CANVAS_WIDTH } from '../constants'
import Factory from '../Factory'
import DrawSystem from '../Systems/DrawSystem'
import HandSystem from '../Systems/HandSystem'
import LaneMovementSystem from '../Systems/LaneMovementSystem'
import AttackSystem from '../Systems/AttackSystem'

const TICK = 1000

export default class MainScene extends Scene {
  facotry?: Factory
  text?: GameObjects.Text

  create() {
    // debug text object
    this.text = this.add.text(CANVAS_WIDTH + 1, 0, '', {
      color: '#fff',
      fontSize: '10px'
    })

    // create entities
    this.facotry = new Factory(this.entityManager, this.add, this.input)
    this.facotry.player()
    this.facotry.opponent()

    // boot systems
    this.systems = [
      new AttackSystem(this.entityManager, this.add, this.input),
      new LaneMovementSystem(this.entityManager, this.add, this.input),
      new DrawSystem(this.entityManager, this.add, this.input),
      new HandSystem(this.entityManager, this.add, this.input)
    ]

    super.create()
  }

  update(time: number, dt: number) {
    super.update(dt)

    const opponent = this.entityManager?.getEntityByTag('opponent')
    const player = this.entityManager?.getEntityByTag('player')
    if (!opponent || !player) return
    const playerCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      player
    ) as CreatureCollection

    const opponentCreatures = this.entityManager.getComponentOfClass(
      CreatureCollection,
      opponent
    ) as CreatureCollection

    this.text?.setText(
      this.debug(
        player,
        opponent,
        ...playerCreatures.entities,
        ...opponentCreatures.entities
      )
    )
  }

  debug(...entities: Entity[]): string {
    return (entities.length ? entities : this.entityManager.getAllEntities())
      .map((entity) => {
        const tag = this.entityManager.getTagByEntity(entity)
        let msg = `--${tag || entity}--\n`
        msg += this.debugEntity(entity)
        return msg
      })
      .join('\n\n---------\n\n')
  }

  debugEntity(entity: Entity): string {
    return this.entityManager
      .getComponents(entity)
      .map((component: Component) => {
        let msg = `${component.toString()}: `
        if (component instanceof Renderer) {
          msg += `\nsprite.x: ${component.sprite.x} sprite.y: ${component.sprite.y}\n`
          return msg
        }

        msg += Object.entries(component)
          .map(([key, value]): string => {
            return ` ${key}: ${value}`
          })
          .join('')

        return msg
      })
      .join('\n')
  }
}
