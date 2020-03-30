import { User } from '../authed-user/types'

export interface Team {
  _id: string;
  name: string;
  userIds: string[];
  score: number;
  lastPrompterIndex: number;
}

export interface Phrase {
  _id: string;
  text: string;
  authorId: string;
}

export interface Turn {
  _id: string;
  userId: string;
  round: number;
  turnLength: number;
  startTime: number | null;
  solvedPhraseIds: string[];
}

export interface Game {
  _id: string;
  shortId: number;
  creatorId: string;
  players: {
    _id: string;
    user: User;
    ready: boolean;
  }[];
  phrases: Phrase[];
  teams: Team[];
  preRoll: {
    show: boolean;
    firstUserId: string | null;
  };
  turns: [Turn];
  unsolvedPhraseIds: string[];
}

export interface ManagerConfig {
  playerStatus?: boolean;
}

export type GameState = Game | null

export const RECEIVE_GAME = 'RECEIVE_GAME'
export interface ReceiveGame {
  type: typeof RECEIVE_GAME;
  game: Game;
}

export type GameActionTypes =
  | ReceiveGame
