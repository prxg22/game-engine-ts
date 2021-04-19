import Phaser from 'phaser'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import MainScene from './Scenes/MainScene'

export const init = () => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'content',
    width: CANVAS_WIDTH * 2,
    height: CANVAS_HEIGHT * 2,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    backgroundColor: 'transparent',
    scene: MainScene
  })
}

init()
