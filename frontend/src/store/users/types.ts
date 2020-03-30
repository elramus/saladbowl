import { User } from '../authed-user/types'

export type UsersState = {
  user: User;
  socketId: string | null;
}[]

export const RECEIVE_USERS = 'RECEIVE_USERS'
export interface ReceiveUsers {
  type: typeof RECEIVE_USERS;
  users: UsersState;
}

export type UserActionTypes =
  | ReceiveUsers
