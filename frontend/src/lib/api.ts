import axios, { AxiosPromise } from 'axios'
import { User } from '../store/authed-user/types'
import { Game, ManagerConfig } from '../store/game/types'

axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api/v1/'

const api = {
  getLoggedInUser: (): AxiosPromise<{ user: User | null }> => {
    return axios.get('/login')
  },

  logInUser: (
    name: string,
  ): AxiosPromise<User> => {
    return axios.post('/login', { name })
  },

  // joinGame: (
  //   gameId: string,
  // ): AxiosPromise<Game> => {
  //   return axios.get(`/games/${gameId}/join`)
  // },

  fetchGame: (
    shortId: string,
  ): AxiosPromise<{ game: Game | null }> => {
    return axios.get(`/games/${shortId}`)
  },

  createGame: (
    userId: string,
  ): AxiosPromise<{ game: Game }> => {
    return axios.post('/games', { userId })
  },

  createTeams: (
    gameId: string,
    teamNames: string[],
  ): AxiosPromise<Game | null> => {
    return axios.put(`/games/${gameId}/create-teams`, { teamNames })
  },

  joinTeam: (
    gameId: string,
    teamId: string,
  ): AxiosPromise<Game> => {
    return axios.put(`/games/${gameId}/join-team`, { teamId })
  },

  createPhrase: (
    text: string,
    gameId: string,
  ): AxiosPromise => {
    return axios.post(`/games/${gameId}/phrases`, { text })
  },

  deletePhrase: ({
    phraseId,
    gameId,
  }: { phraseId: string; gameId: string }): AxiosPromise => {
    return axios.delete(`/games/${gameId}/phrases/${phraseId}`)
  },

  phraseSolved: ({
    gameId,
    phraseId,
    timeRemaining,
  }: {
    gameId: string;
    phraseId: string;
    timeRemaining: number;
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/phrase-solved`, { phraseId, timeRemaining })
  },

  next: ({
    gameId,
    userId,
    config,
  }: {
    gameId: string;
    userId: string | undefined;
    config: ManagerConfig;
  }): AxiosPromise => {
    return axios.put(`/games/${gameId}/next`, { userId, config })
  },
}

export default api
