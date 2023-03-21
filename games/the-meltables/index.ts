import GameEngineTS from '../../lib/GameEngineTS'

import { RenderSystem } from './systems/RenderSystem'

const game = new GameEngineTS([RenderSystem])
window.game = game

declare global {
  interface Window {
    game: GameEngineTS
  }
}
