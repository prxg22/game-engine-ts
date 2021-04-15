import { NONE } from 'phaser'
import { Component } from '../../Core'
import { Vector2D } from '../../Utils/Vector2D'

export enum DIRECTIONS {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
}

export enum MOVEMENT_STATUS {
  MOVING,
  BLOCKED,
  STOP,
}

class MoveComponent implements Component {
  status: MOVEMENT_STATUS = MOVEMENT_STATUS.STOP

  constructor(public direction: Vector2D = [0, 0], public speed: number = 1) {}

  setDirection(h: 1 | 0 | 1 = 0, v: 1 | 0 | 1 = 0) {
    this.direction = [h, v]
  }

  move() {
    this.status = MOVEMENT_STATUS.MOVING
  }

  stop() {
    this.status = MOVEMENT_STATUS.STOP
  }

  block() {
    this.status = MOVEMENT_STATUS.BLOCKED
  }
}

export default MoveComponent
