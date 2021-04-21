import Phaser from 'phaser'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import MainScene from './Scenes/MainScene'
import TestScene from './Scenes/TestScene'

export const init = () => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'content',
    width: CANVAS_WIDTH * 2,
    height: CANVAS_HEIGHT * 2,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
    backgroundColor: '#264653',
    scene: MainScene,
  })
}

init()
