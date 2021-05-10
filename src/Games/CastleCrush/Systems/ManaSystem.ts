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
  text?: Phaser.GameObjects.Text
  speed: number = 100

  create() {
    const [x, y] = P1_HAND_DISPLAY_ORIGIN
    const [, h] = P1_CARD_SIZE
    this.text = this.gameObjectFactory.text(x - 64, y + h / 2, '', {
      color: `#888800`,
    })
  }

  update(dt: number) {
    const players = this.entityManager.getAllEntitiesPosessingComponentOfClasses(
      [Mana],
    )

    players.forEach(player => {
      const mana = this.entityManager.getComponentOfClass(Mana, player) as Mana
      mana.increment(this.speed * 1 + Math.floor(mana.max / 100))
      mana.incrementMax(1)
    })
  }

  render() {
    const mana = this.entityManager.getComponentOfClass(
      Mana,
      this.entityManager.player1 || -1,
    ) as Mana
    this.text?.setText(
      `${Math.floor(mana.current / 100)}/${Math.floor(mana.max / 100)}`,
    )
  }
}

export default ManaSystem
