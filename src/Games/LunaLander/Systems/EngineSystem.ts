import { GameObjects } from 'phaser'
import { System } from '../../../Core'
import Engine from '../Components/Engine'
import Fuel from '../Components/Fuel'
import Renderable from '../Components/Renderable'
import SpatialState from '../Components/SpatialState'

class EngineSystem extends System {
  update(delta: number) {
    const engineAndRendarableEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Engine, Renderable]
    )
    engineAndRendarableEntities.forEach((entity) => {
      const fuel = this.entityManager.getComponentOfClass(Fuel, entity) as Fuel
      const engine = this.entityManager.getComponentOfClass(
        Engine,
        entity
      ) as Engine

      const render = this.entityManager.getComponentOfClass(
        Renderable,
        entity
      ) as Renderable<GameObjects.Sprite>

      if (render) render.sprite.setFrame(0)

      if (engine?.on && fuel?.remaining > 0) {
        const spatial = this.entityManager.getComponentOfClass<SpatialState>(
          SpatialState,
          entity
        )

        if (!render || !spatial) return
        const amount = engine.thrust * delta
        fuel.burn(amount)
        const { rotation } = render || {}

        const dx = -amount * Math.sin((rotation * Math.PI) / 180)
        const dy = amount * Math.cos((rotation * Math.PI) / 180)

        spatial.dx += dx
        spatial.dy += dy
      }
    })
  }

  render() {
    const engineEntities = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Engine, Renderable]
    )
    engineEntities.forEach((entity) => {
      const engine = this.entityManager.getComponentOfClass(
        Engine,
        entity
      ) as Engine

      const render = this.entityManager.getComponentOfClass(
        Renderable,
        entity
      ) as Renderable<GameObjects.Sprite>

      if (engine.on && render) render.sprite.setFrame(1)
      engine.on = false
    })
  }
}

export default EngineSystem
