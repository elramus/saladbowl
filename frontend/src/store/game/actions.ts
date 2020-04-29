import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  RECEIVE_GAME, GameActionTypes, Game, ManagerConfig, PlayedPhrase,
} from './types'
import { AppState } from '..'
import api from '../../lib/api'
import { setLoadingStatus } from '../loading/actions'

export const receiveGame = (
  game: Game,
): GameActionTypes => ({
  type: RECEIVE_GAME,
  game,
})

export const fetchGame = (
  shortId: string,
  cb?: (game: Game | null) => void,
): ThunkAction<void, AppState, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(setLoadingStatus('games', true))
  api.fetchGame(shortId)
    .then(({ data }) => {
      if (data.game) {
        dispatch(receiveGame(data.game))
        dispatch(setLoadingStatus('games', false))
      }
      if (cb) cb(data.game || null)
    })
    .catch(() => {
      dispatch(setLoadingStatus('games', false))
      if (cb) cb(null)
    })
}

export const createGame = (
  teams?: [string, string],
  cb?: (newGame: Game) => void,
): ThunkAction<void, AppState, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.createGame(teams)
    .then(({ data }) => {
      // Put the new game into state
      if (data.game) {
        dispatch(receiveGame(data.game))
        // Callback w/ new game
        if (cb) cb(data.game)
      }
    })
}

export const playerReadyStatus = ({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) => () => {
  api.playerReadyStatus({
    gameId,
    status,
  })
}

export const createTeams = (
  gameId: string,
  teamNames: string[],
): ThunkAction<void, AppState, {}, AnyAction> => (
) => {
  api.createTeams(gameId, teamNames)
}

export const joinTeam = (
  gameId: string,
  teamId: string,
  callback?: () => void,
): ThunkAction<void, AppState, {}, AnyAction> => () => {
  api.joinTeam(gameId, teamId)
    .then(() => {
      if (callback) callback()
    })
}

export const createPhrase = (
  text: string,
  gameId: string,
  cb?: () => void,
): ThunkAction<void, AppState, {}, AnyAction> => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.createPhrase(text, gameId)
    .then(({ data }) => {
      dispatch(receiveGame(data))
      if (cb) cb()
    })
}

export const deletePhrase = (
  gameId: string,
  phraseId: string,
): ThunkAction<void, AppState, {}, AnyAction> => (
  // dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.deletePhrase({ gameId, phraseId })
}

export const solvePhrase = ({
  gameId,
  phraseId,
  timeRemaining,
}: {
  gameId: string;
  phraseId: string;
  timeRemaining: number;
}): ThunkAction<void, AppState, {}, AnyAction> => () => {
  api.solvePhrase({ gameId, phraseId, timeRemaining })
}

export const failPhrase = ({
  gameId,
  phraseId,
}: {
  gameId: string;
  phraseId: string;
}): ThunkAction<void, AppState, {}, AnyAction> => () => {
  api.failPhrase({ gameId, phraseId })
}

export const undoPhrase = ({
  gameId,
  phraseId,
}: {
  gameId: string;
  phraseId: string;
}): ThunkAction<void, AppState, {}, AnyAction> => () => {
  api.undoPhrase({ gameId, phraseId })
}

export const submitPlayedPhrases = ({
  gameId,
  playedPhrases,
}: {
  gameId: string;
  playedPhrases: PlayedPhrase[];
}, callback?: () => void): ThunkAction<void, AppState, {}, AnyAction> => (
  // dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  api.submitPlayedPhrases({ gameId, playedPhrases })
    .then(() => {
      if (callback) callback()
    })
}

export const nextAction = ({
  gameId,
  userId = undefined,
  config = {},
}: {
  gameId: string;
  userId?: string;
  config?: ManagerConfig;
}): ThunkAction<void, AppState, {}, AnyAction> => () => {
  api.nextAction({ gameId, userId, config })
}
