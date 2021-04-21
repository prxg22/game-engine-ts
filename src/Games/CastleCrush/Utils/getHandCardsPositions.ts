import {
  PLAYER_HAND_DISPLAY_ORIGIN,
  MAX_CARDS,
  OPPONENT_HAND_DISPLAY_ORIGIN,
  PLAYER_CARD_SIZE,
  OPPONENT_CARD_SIZE,
} from '../constants'

export default (isPlayer: boolean = true): number[][] => {
  const displayOrigin = isPlayer
    ? PLAYER_HAND_DISPLAY_ORIGIN
    : OPPONENT_HAND_DISPLAY_ORIGIN

  const [handOriginX, handOriginY] = displayOrigin
  const [width] = isPlayer ? PLAYER_CARD_SIZE : OPPONENT_CARD_SIZE

  const positions = []
  for (let index = 0; index < MAX_CARDS; index++) {
    positions.push([index * width * 2 + handOriginX, handOriginY])
  }

  return positions
}
