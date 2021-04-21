import { System } from '../../../Core'
import Mana from '../Components/Mana'
import BaseSystem from './BaseSystem'

class ManaSystem extends BaseSystem {
  countTicks: number = 0

  update() {
    if (this.tick) this.countTicks += 1
    if (this.countTicks < 100) return
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Mana],
    )

    players.forEach(player => {
      const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana

      if (!mana) return

      mana.increment()
      if (!(this.countTicks % 20)) mana.incrementMax()
    })
    this.countTicks = 0
  }
}

export default ManaSystem
