import Phaser from 'phaser'
import MainScene from './Scenes/MainScene'

export const init = () => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade'
    },
    backgroundColor: '#000',
    scene: MainScene
  })
}

init()
