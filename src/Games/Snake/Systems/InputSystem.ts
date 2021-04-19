import { Entity, System } from '../../../Core'
import Alive from '../Components/Alive'
import Input from '../Components/Input'
import Spatial from '../Components/Spatial'
import { KEY_UP, KEY_RIGHT, KEY_LEFT, KEY_DOWN, VELOCITY } from '../constants'
import TickSystem from './TickSystem'

export default class InputSystem extends System {
  inputManager: Map<Entity, Phaser.Input.Keyboard.Key | undefined> = new Map()
  time: number = 0

  update(dt: number) {
    const inputAndSpatialEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Input, Spatial]
    )

    inputAndSpatialEntities.forEach((entity) => {
      const alive = this.entityManager.getComponentOfClass(
        Alive,
        entity
      ) as Alive

      if (alive && !alive.isAlive) return

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
      if (this.time < TickSystem.tick) return
      this.time = 0
      const spatial = this.entityManager.getComponentOfClass(
        Spatial,
        entity
      ) as Spatial

      const key = this.inputManager.get(entity)
      // flushes inputManager key after tick
      this.inputManager.set(entity, undefined)
      if (!key) return

      switch (key.keyCode) {
        case KEY_UP:
          if (spatial.dy === VELOCITY) return
          spatial.dx = 0
          spatial.dy = -VELOCITY
          break
        case KEY_DOWN:
          if (spatial.dy === -VELOCITY) return
          spatial.dx = 0
          spatial.dy = VELOCITY
          break
        case KEY_RIGHT:
          if (spatial.dx === -VELOCITY) return
          spatial.dx = VELOCITY
          spatial.dy = 0
          break
        case KEY_LEFT:
          if (spatial.dx === VELOCITY) return
          spatial.dx = -VELOCITY
          spatial.dy = 0
          break
      }
    })
  }
}
