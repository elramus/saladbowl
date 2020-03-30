import { RECEIVE_USERS, UserActionTypes, UsersState } from './types'

export const receiveUsers = (
  users: UsersState,
): UserActionTypes => ({
  type: RECEIVE_USERS,
  users,
})
