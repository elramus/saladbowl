import { UsersState, UserActionTypes, RECEIVE_USERS } from './types'

export const initialState: UsersState = []

const authedUser = (
  state: UsersState = initialState,
  action: UserActionTypes,
): UsersState => {
  switch (action.type) {
    case RECEIVE_USERS:
      return action.users
    default:
      return state
  }
}

export default authedUser
