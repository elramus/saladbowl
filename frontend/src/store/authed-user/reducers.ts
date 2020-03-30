import { AuthedUserState, AuthedUserActionTypes, RECEIVE_USER } from './types'

export const initialState: AuthedUserState = null

const authedUser = (
  state: AuthedUserState = initialState,
  action: AuthedUserActionTypes,
): AuthedUserState => {
  switch (action.type) {
    case RECEIVE_USER:
      return {
        ...state,
        ...action.user,
      }
    default:
      return state
  }
}

export default authedUser
