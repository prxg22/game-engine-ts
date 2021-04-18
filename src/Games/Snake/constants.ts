export const TICK = 100000

// dimensions
export const GRID_SIZE = 16
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const MAX_X = CANVAS_WIDTH / GRID_SIZE - 1
export const MAX_Y = CANVAS_HEIGHT / GRID_SIZE - 1

// colors
export const FRAME_COLOR = 0x000ff
export const APPLE_COLOR = 0xff0000
export const SNAKE_COLOR = 0x00ff00
export const NEUTRAL = 0xffffff

// inputs
export const KEY_UP = Phaser.Input.Keyboard.KeyCodes.W
export const KEY_LEFT = Phaser.Input.Keyboard.KeyCodes.A
export const KEY_DOWN = Phaser.Input.Keyboard.KeyCodes.S
export const KEY_RIGHT = Phaser.Input.Keyboard.KeyCodes.D
