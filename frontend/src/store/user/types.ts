export type User = {
  _id: string
  name: string
  ipAddress: string | null
  socketId: string | null
}

export type UserState = User | null

export const RECEIVE_USER = 'RECEIVE_USER'
export interface ReceiveUser {
  type: typeof RECEIVE_USER
  user: User
}

export type UserActionTypes = ReceiveUser
