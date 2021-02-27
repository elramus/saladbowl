import axios, { AxiosPromise } from 'axios'
import { User } from '../store/user/types'
import { Game, ManagerConfig, PlayedPhrase } from '../store/game/types'

axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api/v1/'

const api = {
  getLoggedInUser: (): AxiosPromise<{ user: User | null }> => {
    return axios.get('/login')
  },

  logInUser: (name: string): AxiosPromise<{ user: User }> => {
    return axios.post('/login', { name })
  },

  fetchGame: (shortId: string): AxiosPromise<{ game: Game | null }> => {
    return axios.get(`/games/${shortId}`)
  },

  createGame: (
    teams: [string, string] | undefined,
  ): AxiosPromise<{ game: Game }> => {
    return axios.post('/games', { teams })
  },

  createTeams: (
    gameId: string,
    teamNames: string[],
  ): AxiosPromise<Game | null> => {
    return axios.put(`/games/${gameId}/create-teams`, { teamNames })
  },

  joinTeam: (gameId: string, teamId: string): AxiosPromise<Game> => {
    return axios.put(`/games/${gameId}/join-team`, { teamId })
  },

  playerReadyStatus: ({
    gameId,
    status,
  }: {
    gameId: string
    status: boolean
  }): AxiosPromise<{ game: Game }> => {
    return axios.put(`/games/${gameId}/player-ready-status`, {
      readyStatus: status,
    })
  },

  createPhrase: (text: string, gameId: string): AxiosPromise => {
    return axios.post(`/games/${gameId}/phrases`, { text })
  },

  deletePhrase: ({
    phraseId,
    gameId,
  }: {
    phraseId: string
    gameId: string
  }): AxiosPromise => {
    return axios.delete(`/games/${gameId}/phrases/${phraseId}`)
  },

  solvePhrase: ({
    gameId,
    phraseId,
    timeRemaining,
  }: {
    gameId: string
    phraseId: string
    timeRemaining: number
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/solve-phrase`, {
      phraseId,
      timeRemaining,
    })
  },

  failPhrase: ({
    gameId,
    phraseId,
  }: {
    gameId: string
    phraseId: string
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/fail-phrase`, { phraseId })
  },

  undoPhrase: ({
    gameId,
    phraseId,
  }: {
    gameId: string
    phraseId: string
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/undo-phrase`, { phraseId })
  },

  submitPlayedPhrases: ({
    gameId,
    playedPhrases,
  }: {
    gameId: string
    playedPhrases: PlayedPhrase[]
  }) => {
    return axios.post(`/games/${gameId}/submit-played-phrases`, {
      playedPhrases,
    })
  },

  voteToSkip: (gameId: string): AxiosPromise<string> => {
    return axios.get(`/games/${gameId}/vote-to-skip-turn`)
  },

  nextAction: ({
    gameId,
    userId,
    config,
  }: {
    gameId: string
    userId: string | undefined
    config: ManagerConfig
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/next-action`, { userId, config })
  },
}

export default api
