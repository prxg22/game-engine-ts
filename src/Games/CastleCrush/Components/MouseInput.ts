import { Component } from '../../../Core'

export interface Area {
  x: number
  y: number
  width: number
  height: number
}

export default class MouseInput extends Component {
  public areas: Area[]
  private clickedIndexes: number[] = []

  // como convenção vamos utilizar:
  // - os n (n = HAND_MAX_CARD) primeiros indices para as posições da carta do player
  // - n + 3 para as lanes
  constructor(...areas: Area[]) {
    super()
    this.areas = areas
  }

  // retorna o clickedIndexes e o reinicia
  flush(): number[] {
    const clickedIndexes = this.clickedIndexes
    this.clickedIndexes = []
    return clickedIndexes
  }

  // verifica se na posição do clique estava uma das áreas requeridas
  // e a adiciona no clickedIndexes
  click(x: number, y: number) {
    this.areas.forEach((body, index) => {
      if (!this.clickedOnBody(body, x, y)) return
      this.clickedIndexes.push(index)
    })
  }

  private clickedOnBody(body: Area, x: number, y: number): boolean {
    return (
      x >= body.x &&
      x <= body.x + body.width &&
      y >= body.y &&
      y <= body.y + body.height
    )
  }
}
