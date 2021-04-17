import { System } from '../../../Core'
import Engine from '../Components/Engine'
import Fuel from '../Components/Fuel'
import Renderable from '../Components/Renderable'
import SpatialState from '../Components/SpatialState'

class EngineSystem extends System {
  update(delta: number) {
    const engineEntities = this.entityManager.getAllEntitiesPosessingComponentOfClass<Engine>(
      Engine
    )
    engineEntities.forEach((entity) => {
      const fuel = this.entityManager.getComponentOfClass(Fuel, entity) as Fuel
      const engine = this.entityManager.getComponentOfClass(
        Engine,
        entity
      ) as Engine

      if (engine?.on && fuel?.remaining > 0) {
        const spatial = this.entityManager.getComponentOfClass<SpatialState>(
          SpatialState,
          entity
        )
        const renderable = this.entityManager.getComponentOfClass<
          Renderable<Phaser.GameObjects.Sprite>
        >(Renderable, entity)

        if (!renderable || !spatial) return
        const amount = engine.thrust * delta
        fuel.burn(amount)
        const { rotation } = renderable || {}

        const dx = -amount * Math.sin((rotation * Math.PI) / 180)
        const dy = -amount * Math.cos((rotation * Math.PI) / 180)

        spatial.dx += dx
        spatial.dy += dy

        engine.on = false
      }
    })
  }
}

export default EngineSystem
