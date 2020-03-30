export type User = {
  _id: string;
  name: string;
  socketId?: string;
}

export type AuthedUserState = User | null;

export const RECEIVE_USER = 'RECEIVE_USER'
export interface ReceiveUser {
  type: typeof RECEIVE_USER;
  user: User;
}

export type AuthedUserActionTypes =
  | ReceiveUser
