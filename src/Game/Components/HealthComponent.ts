import Phaser from 'phaser'
import Component from '../../Core/Component'

class HealthComponent implements Component {
  alive: boolean = true

  constructor(
    public currentHp: number = 100,
    public maxHp: number = 100,
    public node?: Phaser.GameObjects.Text,
  ) {}
}

export default HealthComponent
