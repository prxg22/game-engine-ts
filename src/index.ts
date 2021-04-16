import Phaser from 'phaser'
import BattleScene from './Game/Scenes/BattleScene'

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  backgroundColor: 'transparent',
  scene: BattleScene
})
