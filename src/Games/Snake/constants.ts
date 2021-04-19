import Phaser from 'phaser'
export const TICK = 100000

// dimensions
export const GRID_SIZE = 8
export const CANVAS_WIDTH = 320
export const CANVAS_HEIGHT = 240
export const MAX_X = CANVAS_WIDTH / GRID_SIZE - 1
export const MAX_Y = CANVAS_HEIGHT / GRID_SIZE - 1
export const VELOCITY = 1

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

// sprite frames
export const SNAKE_FRAME_UP = 49
export const SNAKE_FRAME_LEFT = 50
export const SNAKE_FRAME_DOWN = 51
export const SNAKE_FRAME_RIGHT = 52
export const SNAKE_FRAME_BODY = 53

export const APPLE_FRAME = 54

export const FRAME_FRAME_UP = 39
export const FRAME_FRAME_LEFT = 40
export const FRAME_FRAME_RIGHT = 41
export const FRAME_FRAME_DOWN = 42
