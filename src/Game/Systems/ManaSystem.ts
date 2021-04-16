import { System } from '../../Core'
import ManaComponent from '../Components/ManaComponent'

class ManaSystem extends System {
  private lastTick: number = 0
  update(tick: number) {
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClass<ManaComponent>(
      ManaComponent
    )

    players.forEach((player) => {
      const mana = this.entityManager.getComponentOfClass<ManaComponent>(
        ManaComponent,
        player
      )

      if (!mana) return

      mana.increment()
      if (tick - this.lastTick < mana.max) {
        return
      }
      this.lastTick = tick
      mana.incrementMax()
    })
  }
}

export default ManaSystem
