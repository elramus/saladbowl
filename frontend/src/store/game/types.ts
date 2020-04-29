import { User } from '../user/types'

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

export interface PlayedPhrase {
  phraseId: string;
  solved: boolean;
  timestamp: number;
  duration: number;
}

export interface Turn {
  _id: string;
  userId: string;
  teamId: string;
  round: 0 | 1 | 2 | 3;
  turnLength: number;
  showCountdown: boolean;
  startTime: number | null;
  playedPhrases: PlayedPhrase[];
}

export interface Game {
  _id: string;
  shortId: number;
  creatorId: string;
  startTime: number | null;
  players: {
    user: User;
    readyToPlay: boolean;
  }[];
  teams: Team[];
  phrases: Phrase[];
  preRoll: {
    show: boolean;
    firstTeamId: string | null;
  };
  turns: Turn[];
  gameOver: boolean;
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
