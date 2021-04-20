import {
  PLAYER_HAND_DISPLAY_ORIGIN,
  HAND_MAX_CARD,
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
  for (let index = 0; index < HAND_MAX_CARD; index++) {
    positions.push([index * width * 2 + handOriginX, handOriginY])
  }

  return positions
}
