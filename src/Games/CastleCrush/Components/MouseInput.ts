import { Component } from '../../../Core'

export interface Area {
  x: number
  y: number
  width: number
  height: number
}

export interface ResponsiveAreas {
  [name: string]: Area
}

export interface ResponsePosition {
  [name: string]: number[] | undefined
}

export default class MouseInput extends Component {
  private responsePositions: ResponsePosition = {}

  constructor(public responsiveAreas: ResponsiveAreas) {
    super()
  }

  // retorna a responsePositions e o reinicia
  flush(): ResponsePosition {
    const responsePositions = Object.assign({}, this.responsePositions)

    this.responsePositions = {}

    return responsePositions
  }

  // verifica se na posição do clique estava uma das áreas requeridas
  // e a adiciona seu nome na responsePositions
  click(x: number, y: number) {
    Object.entries(this.responsiveAreas).forEach(([name, area]) => {
      if (!this.clickedOnBody(x, y, area)) return
      this.responsePositions[name] = [x, y]
    })
  }

  private clickedOnBody(x: number, y: number, body: Area): boolean {
    return (
      x >= body.x &&
      x <= body.x + body.width &&
      y >= body.y &&
      y <= body.y + body.height
    )
  }
}
