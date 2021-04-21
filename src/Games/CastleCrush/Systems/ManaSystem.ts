import { System } from '../../../Core'
import Mana from '../Components/Mana'
import {
  BACKCOVER_CARD_COLOR,
  P1_CARD_SIZE,
  P1_HAND_DISPLAY_ORIGIN,
} from '../constants'
import BaseSystem from './BaseSystem'

class ManaSystem extends BaseSystem {
  countTicks: number = 0
  text?: Phaser.GameObjects.Text

  create() {
    const [x, y] = P1_HAND_DISPLAY_ORIGIN
    const [w, h] = P1_CARD_SIZE
    this.text = this.gameObjectFactory.text(x - 64, y + h / 2, '', {
      color: `#888800`,
    })
  }

  update() {
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Mana],
    )
    if (this.clock) this.countTicks += 1
    if (this.countTicks < 100) return

    players.forEach(player => {
      const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana

      if (!mana) return

      mana.increment()
      if (!(this.countTicks % 20)) mana.incrementMax()
    })
    this.countTicks = 0
  }
  render() {
    const mana = this.entityManager.getComponentOfClass(
      Mana,
      this.entityManager.getEntityByTag('player') || -1,
    ) as Mana
    this.text?.setText(`${mana.current}/${mana.max}`)
  }
}

export default ManaSystem
