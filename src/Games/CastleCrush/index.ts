import Phaser from 'phaser'
import BattleScene from './Scenes/BattleScene'

export const init = () => {
  return new Phaser.Game({
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
}

init()
