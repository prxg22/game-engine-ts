import System from "../core/System"
import HealthComponent from "./HealthComponent"
import RenderComponent from "./RenderComponent"

class HealthSystem extends System {
  update() {
    const entities = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      HealthComponent
    )

    entities.forEach((entity) => {
      const health = <HealthComponent>(
        this.entityManager.getComponentOfClass(HealthComponent, entity)
      )

      if (!health.alive) this.entityManager.removeEntity(entity)
      health.alive = health.currentHp <= 0
    })
  }

  render(dt: number) {
    const entities = this.entityManager.getAllEntitiesPosessingComponentOfClass(
      HealthComponent
    )

    entities.forEach((entity) => {
      const health = <HealthComponent>(
        this.entityManager.getComponentOfClass(HealthComponent, entity)
      )
      const render = <RenderComponent | undefined>(
        this.entityManager.getComponentOfClass(RenderComponent, entity)
      )

      if (!health || !render) return

      if (!health.alive) {
        render?.node.destroy()
        return
      }

      render.node.active = true
      if (health.node) {
        health.node.active = true
        health.node.setPosition(render.node.x, render.node.y - 10)
        health.node.text = `${health.currentHp}/${health.maxHp}`
        health.node.updateText()
      }
    })
  }
}

export default HealthSystem
