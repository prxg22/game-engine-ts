import Phaser from 'phaser'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import MainScene from './Scenes/MainScene'

export const init = () => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'content',
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    // width: CANVAS_WIDTH + 300,
    // height: CANVAS_HEIGHT + 800,
    physics: {
      default: 'arcade'
    },
    backgroundColor: '#000',
    scene: MainScene
  })
}

init()
