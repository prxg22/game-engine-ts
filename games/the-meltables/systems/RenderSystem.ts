import type { System } from '../../../lib'

export class RenderSystem implements System {
  private canvas: {
    size: [number, number]
    element: HTMLCanvasElement | null
  } = {
    size: [0, 0],
    element: null,
  }

  get width() {
    return this.canvas.size[0]
  }

  get height() {
    return this.canvas.size[1]
  }

  set width(width: number) {
    if (!this.canvas.element) return
    this.canvas.size[0] = width
    this.canvas.element.width = width
  }

  set height(height: number) {
    if (!this.canvas.element) return
    this.canvas.size[1] = height
    this.canvas.element.height = height
  }

  get context() {
    return this.canvas.element?.getContext('2d')
  }

  load() {
    this.canvas.element = document.createElement('canvas')

    const [width, height] = this.canvas.size

    this.width = width || window.document.body.offsetWidth
    this.height = height || window.document.body.offsetHeight

    window.document.body.appendChild(this.canvas.element)
  }

  render(dt?: number | undefined): void {
    if (this.context) {
      this.context.fillStyle = 'black'
      this.context.fillRect(0, 0, this.width, this.height)
    }
  }
}
