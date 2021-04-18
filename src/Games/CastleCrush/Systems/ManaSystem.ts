import { System } from '../../../Core'
import ManaComponent from '../Components/ManaComponent'

class ManaSystem extends System {
  private lastTick: number = 0
  update(tick: number) {
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [ManaComponent]
    )

    players.forEach((player) => {
      const mana = this.entityManager.getComponentOfClass<ManaComponent>(
        ManaComponent,
        player
      )

      if (!mana) return

      if (!(tick % 3)) mana.increment()
      if (tick - this.lastTick >= mana.max) {
        this.lastTick = tick
        mana.incrementMax()
      }
    })
  }
}

export default ManaSystem
