import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RECEIVE_USER, AuthedUserActionTypes, User } from './types'
import { AppState } from '..'
import api from '../../lib/api'

export const receiveUser = (
  user: User,
): AuthedUserActionTypes => ({
  type: RECEIVE_USER,
  user,
})

export const getLoggedInUser = (): ThunkAction<void, AppState, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.getLoggedInUser()
    .then(({ data }) => {
      if (data.user) {
        dispatch(receiveUser(data.user))
      }
    })
}

export const logInUser = (
  name: string,
): ThunkAction<void, AppState, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.logInUser(name)
    .then(({ data }) => {
      if (data.user) {
        dispatch(receiveUser(data.user))
      }
    })
}
