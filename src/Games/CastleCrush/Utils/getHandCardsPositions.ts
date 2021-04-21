import {
  P1_HAND_DISPLAY_ORIGIN,
  MAX_CARDS,
  P2_HAND_DISPLAY_ORIGIN,
  P1_CARD_SIZE,
  P2_CARD_SIZE,
} from '../constants'

export default (isPlayer: boolean = true): number[][] => {
  const displayOrigin = isPlayer
    ? P1_HAND_DISPLAY_ORIGIN
    : P2_HAND_DISPLAY_ORIGIN

  const [handOriginX, handOriginY] = displayOrigin
  const [width] = isPlayer ? P1_CARD_SIZE : P2_CARD_SIZE

  const positions = []
  for (let index = 0; index < MAX_CARDS; index++) {
    positions.push([index * width * 2 + handOriginX, handOriginY])
  }

  return positions
}
