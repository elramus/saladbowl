import { IGame } from '../games/games.model'
import { io } from '../app'
import { SocketMessages } from '../socket'
import { shuffleArray } from '../utils/shuffleArray'
import { randomNum } from '../utils/randomNum'
import { IUser } from '../users/users.model'
import { getNextTurn } from './getNextTurn'
import { ITurn } from '../turns/turns.model'

interface TurnRunnerConfig {
  playerStatus?: boolean;
  timeRemaining?: number;
}

export class GameManager {
  private game: IGame
  private user: IUser
  private config: TurnRunnerConfig | undefined

  constructor({
    game,
    user,
    config,
  }: {
    game: IGame;
    user: IUser;
    config?: TurnRunnerConfig;
  }) {
    this.game = game
    this.user = user
    this.config = config
  }

  async next() {
    // If any turns have been taken, get the first one to see what
    // round it is. Just don't forget to unshift new turns instead
    // of pushing :)
    const currentRound = this.game.turns.length
      ? this.game.turns[0].round
      : 0

    if (currentRound === 0) {
      // The game has not started yet, so this call is just someone changing their
      // ready status.
      await this.playerReadyToPlay()

      // Okay, are we ready to start the game now?
      const allPlayersReady = this.game.players.every((p) => p.ready)
      const eachTeamHasPlayer = this.game.teams.every((t) => t.userIds.length > 0)

      if (allPlayersReady && eachTeamHasPlayer) {
        await this.preRoll()
      }
      return
    }

    if (currentRound === 3 && this.game.unsolvedPhraseIds.length === 0) {
      // Game over man!!
      this.game.gameOver = true
      await this.game.save()
      this.emit()
    }

    const currentTurn: ITurn = this.game.turns[0]

    // If we're in a round but it hasn't started yet.
    if (currentRound > 0 && !currentTurn.startTime) {
      // This will timestamp it, starting the round on the front end.
      // 60 seconds later, the turn ends and we trigger another reflow of next().
      await this.beginPrompting()
      return
    }

    if (currentRound > 0 // We're in a round.
      && currentTurn.startTime // The round has happened...
      && this.game.unsolvedPhraseIds.length > 0 // But there are more phrases!
    ) {
      try {
        const [nextPlayerIndex, nextPlayerId, teamUpNext] = getNextTurn(this.game, this.user)

        // Update the last prompter on the team.
        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // Create a new turn.
        this.game.turns.unshift({
          userId: nextPlayerId,
          round: currentRound, // Same round as last time because we're not done.
        })

        // Ship it out!
        await this.game.save()
        this.emit()
      } catch (e) {
        throw new Error(e)
      }
    }

    if (currentRound > 0
      && currentTurn.startTime
      && this.game.unsolvedPhraseIds.length === 0
    ) {
      // A turn just ended, but there are no more phrases.
      if (currentRound < 3) {
        // New round!! Reset and shuffle the phrases.
        this.game.unsolvedPhraseIds = shuffleArray(this.game.phrases.map((p) => p._id))

        // Create the turn.
        this.game.turns.unshift({
          userId: this.user._id,
          round: currentRound + 1,
          turnLength: this.config?.timeRemaining ?? 60,
        })

        // Ship it out.
        await this.game.save()
        this.emit()
      } else {
        console.log('Game over, man.') /*eslint-disable-line*/
      }
    }
  }

  async preRoll() {
    // Start the first pre-roll screen.
    this.game.preRoll = {
      show: true,
      firstUserId: undefined,
    }
    await this.game.save()
    this.emit()

    // The pre-roll is now happening on the frontend...

    // Get a random team.
    const randomTeamIndex = randomNum(0, this.game.teams.length - 1)
    const firstTeam = this.game.teams[randomTeamIndex]
    // Get a random player.
    const randomPlayerIndex = randomNum(0, firstTeam.userIds.length - 1)
    const firstUserId = firstTeam.userIds[randomPlayerIndex]

    if (!firstUserId) throw new Error('Error getting first player ID')

    // Mark on the team the index of the chosen player.
    this.game.teams.pull(firstTeam._id)
    firstTeam.lastPrompterIndex = randomPlayerIndex
    this.game.teams.push(firstTeam)
    await this.game.save()

    // After 3 seconds from now, show who's up first.
    setTimeout(async () => {
      const newPreRoll = {
        show: true,
        firstUserId,
      }
      this.game.preRoll = newPreRoll
      await this.game.save()
      this.emit()
    }, 3000)

    // After 6 seconds from now, end pre-roll and fire off round one.
    setTimeout(async () => {
      this.prepNewRound(1, firstUserId)
    }, 6000)
  }

  async prepNewRound(roundNum: number, upFirstId: string) {
    // Reset the pre-roll.
    if (roundNum === 1) {
      this.game.preRoll = {
        show: false,
        firstUserId: undefined,
      }
    }

    // The unsolved phrases starts as just a shuffle of all the phrases.
    this.game.unsolvedPhraseIds = shuffleArray(this.game.phrases.map((p) => p._id))

    // Create the turn.
    this.game.turns.unshift({
      userId: upFirstId,
      round: roundNum,
    })

    // The frontend is now waiting on the prompter to push Ready,
    // triggering another reflow of next().
    try {
      await this.game.save()
      this.emit()
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async beginPrompting() {
    // A turn exists, but we need to give it a start time.
    this.game.turns[0].startTime = Date.now()
    await this.game.save()
    this.emit()
  }

  async playerReadyToPlay() {
    // Get the player
    const player = this.game.players.find((p) => p.user._id.equals(this.user?._id))
    if (player && this.config?.playerStatus !== undefined) {
      // Mark them whatever was passed in.
      player.ready = this.config.playerStatus
      // Pull the old player off
      this.game.players.pull(player._id)
      // Push the updated one on.
      this.game.players.push(player)
      await this.game.save()
      this.emit()
    }
  }

  // Broadcast an update.
  emit() {
    io.to(this.game._id).emit(SocketMessages.GameUpdate, this.game)
  }
}
