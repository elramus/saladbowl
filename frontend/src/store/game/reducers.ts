import { GameState, GameActionTypes, RECEIVE_GAME } from './types'

export const initialState: GameState = null

const game = (
  state: GameState = initialState,
  action: GameActionTypes,
): GameState => {
  switch (action.type) {
    case RECEIVE_GAME:
      // Update if it's a newer version.
      if (!state || state.__v < action.game.__v) {
        return action.game
      }
      return state
    default:
      return state
  }
}

export default game
