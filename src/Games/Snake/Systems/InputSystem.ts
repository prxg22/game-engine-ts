import { Entity, System } from '../../../Core'
import Input from '../Components/Input'
import Spatial from '../Components/Spatial'
import { KEY_UP, KEY_RIGHT, KEY_LEFT, KEY_DOWN, TICK } from '../constants'

const VELOCITY = 1

const DIRECTIONS = {
  NONE: 0,
  POSITIVE: VELOCITY,
  NEGATIVE: -VELOCITY
}
export default class InputSystem extends System {
  inputManager: Map<Entity, Phaser.Input.Keyboard.Key | undefined> = new Map()
  time: number = 0

  update(dt: number) {
    const inputAndSpatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Input, Spatial]
    )

    inputAndSpatialEntities.forEach((entity) => {
      // stores mapped keys which are down before tick
      const input = this.entityManager.getComponentOfClass(
        Input,
        entity
      ) as Input

      this.inputManager.set(
        entity,
        input.down[0] || this.inputManager.get(entity)
      )

      this.time += dt
      if (this.time < TICK) return
      this.time = 0
      // flushes inputManager key after tick
      // do whatever it has to do with inputs
      const spatial = this.entityManager.getComponentOfClass(
        Spatial,
        entity
      ) as Spatial

      const key = this.inputManager.get(entity)
      this.inputManager.set(entity, undefined)
      if (!key) return

      switch (key.keyCode) {
        case KEY_UP:
          if (spatial.dy === DIRECTIONS.POSITIVE) return
          spatial.dx = DIRECTIONS.NONE
          spatial.dy = DIRECTIONS.NEGATIVE
          break
        case KEY_DOWN:
          if (spatial.dy === DIRECTIONS.NEGATIVE) return
          spatial.dx = DIRECTIONS.NONE
          spatial.dy = DIRECTIONS.POSITIVE
          break
        case KEY_RIGHT:
          if (spatial.dx === DIRECTIONS.NEGATIVE) return
          spatial.dx = DIRECTIONS.POSITIVE
          spatial.dy = DIRECTIONS.NONE
          break
        case KEY_LEFT:
          if (spatial.dx === DIRECTIONS.POSITIVE) return
          spatial.dx = DIRECTIONS.NEGATIVE
          spatial.dy = DIRECTIONS.NONE
          break
      }
    })
  }
}
