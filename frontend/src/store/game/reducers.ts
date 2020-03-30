import { GameState, GameActionTypes, RECEIVE_GAME } from './types'

export const initialState: GameState = null

const authedUser = (
  state: GameState = initialState,
  action: GameActionTypes,
): GameState => {
  switch (action.type) {
    case RECEIVE_GAME:
      return action.game
    default:
      return state
  }
}

export default authedUser
