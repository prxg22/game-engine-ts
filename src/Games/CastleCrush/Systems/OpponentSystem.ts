import Input from '../Components/Input'
import BaseSystem from '../Core/BaseSystem'

export default class OpponentSystem extends BaseSystem {
  clock() {
    const input = this.entityManager.getComponentOfClass(
      Input,
      this.entityManager.player1,
    ) as Input

    input.down.forEach(key => {
      if (key.keyCode !== Phaser.Input.Keyboard.KeyCodes.SPACE) return
      this.factory?.mockCreature(this.entityManager.player2)
    })
  }
}
