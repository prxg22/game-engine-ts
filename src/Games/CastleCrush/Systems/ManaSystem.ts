import { System } from '../../../Core'
import MainScene from '../../CastleCrush/Scenes/MainScene'
import Mana from '../Components/Mana'
import {
  BACKCOVER_CARD_COLOR,
  P1_CARD_SIZE,
  P1_HAND_DISPLAY_ORIGIN,
  P1_TAG,
} from '../constants'
import BaseSystem from '../Core/BaseSystem'

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

  clock(dt: number) {
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Mana],
    )

    this.countTicks += 1
    if (this.countTicks < 4) return
    this.countTicks += 0

    players.forEach(player => {
      const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana

      if (!mana) return

      mana.increment()
      if (!(this.countTicks % 4)) mana.incrementMax()
    })
    this.countTicks = 0
  }

  render() {
    const mana = this.entityManager.getComponentOfClass(
      Mana,
      this.entityManager.player1 || -1,
    ) as Mana
    this.text?.setText(`${mana.current}/${mana.max}`)
  }
}

export default ManaSystem
