import { Component } from '../../Core'
import { Vector2D } from '../../Utils/Vector2D'

class RigidBodyComponent implements Component {
  constructor(public position: Vector2D, public size?: Vector2D) {}

  get x(): number {
    return this.position[0]
  }

  set x(x: number) {
    if (x < 800 / 16) this.position[0] = x
  }

  get y(): number {
    return this.position[1]
  }

  set y(y: number) {
    if (y < 600 / 16) this.position[1] = y
  }

  get w(): number | undefined {
    if (!this.size) return
    return this.size[0]
  }

  set w(w: number | undefined) {
    if (!this.size || typeof w === 'undefined') return

    this.size[0] = w
  }

  get h(): number | undefined {
    if (!this.size) return
    return this.size[1]
  }

  set h(h: number | undefined) {
    if (!this.size || typeof h === 'undefined') return
    this.size[1] = h
  }

  setPosition(x?: number, y?: number) {
    if (typeof x === 'number') this.x = x
    if (typeof y === 'number') this.y = y
  }

  setSize(w: number, h: number) {
    if (typeof w === 'number') this.w = w
    if (typeof h === 'number') this.h = h
  }
}

export default RigidBodyComponent
