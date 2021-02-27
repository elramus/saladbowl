export enum NextActions {
  FIRED_PREPGAME = 'Fired prepGame',
  FINISH_PREROLL_ADD_TURN = 'Preroll just finished, added new turn.',
  GAME_OVER = 'Game over, man!',
  STARTING_COUNTDOWN = 'Starting the 3-second countdown into a turn',
  SAME_ROUND_NEXT_PLAYER = 'Same round, next player',
  SAME_ROUND_NEXT_PLAYER_SAME_TEAM = 'Same round, next player, same team',
  NEXT_ROUND_SAME_PLAYER = 'Next round, same player',
  NEXT_ROUND_NEXT_PLAYER = 'Next round, next player',
  NO_ACTION = 'None of the nextAction ifs triggered...'
}
