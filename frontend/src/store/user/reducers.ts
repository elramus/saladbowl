import { UserState, UserActionTypes, RECEIVE_USER } from './types'

export const initialState: UserState = null

const user = (
  state: UserState = initialState,
  action: UserActionTypes,
): UserState => {
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

export default user
