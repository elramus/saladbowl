export interface LoadingState {
  users: boolean
  games: boolean
}

export const SET_LOADING_STATUS = 'SET_LOADING_STATUS'

export interface SetLoadingStatus {
  type: typeof SET_LOADING_STATUS
  name: keyof LoadingState
  status: boolean
}

export type LoadingActionTypes = SetLoadingStatus
