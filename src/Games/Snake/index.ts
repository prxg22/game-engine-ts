import Phaser from 'phaser'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import MainScene from './Scenes/MainScene'

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'content',
  // width: CANVAS_WIDTH,
  width: CANVAS_WIDTH + 300,
  height: CANVAS_HEIGHT,
  // height: CANVAS_HEIGHT,
  physics: {
    default: 'arcade'
  },
  backgroundColor: '#000',
  scene: MainScene
})
