import { IGame } from '../games/games.model'
import { io } from '../app'
import { SocketMessages } from '../socket'
import { shuffleArray } from '../utils/shuffleArray'
import { randomNum } from '../utils/randomNum'
import { IUser } from '../users/users.model'
import { getNextTurn } from './getNextTurn'
import { ITurn } from '../turns/turns.model'
import { chooseFirstPlayer } from './chooseFirstPlayer'

interface TurnRunnerConfig {
  playerStatus?: boolean;
  timeRemaining?: number;
}

export class TurnRunner {
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

    // Fire off the pre-game pre-roll!
    if (currentRound === 0 && !this.game.preRoll.show) {
      await this.gamePreRoll()
      return
    }

    // Game over man!!
    if (currentRound === 3 && this.game.unsolvedPhraseIds.length === 0) {
      this.game.gameOver = true
      await this.game.save()
      this.emit()
    }

    const currentTurn: ITurn = this.game.turns[0]

    // If we're in a round, and preRoll hasn't happened, and the turn hasn't started,
    // then the player has just said they're ready to start prompting.
    if (currentRound > 0 && !this.game.preRoll.show && !currentTurn.startTime) {
      // Give 'em the countdown.
      this.game.turns[0].showCountdown = true
      await this.game.save()
      this.emit()

      // Frontend clock is counting down three seconds...
      // Then we fire.
      setTimeout(() => {
        this.beginPrompting()
      }, 3000)

      return
    }

    if (currentRound > 0 // We're in a round.
      && currentTurn.startTime // The round has happened...
      && this.game.unsolvedPhraseIds.length > 0 // But there are more phrases!
    ) {
      // Stay in this round, but make a new turn for the next person.
      try {
        const [nextPlayerIndex, nextPlayerId, teamUpNext] = getNextTurn(this.game, this.user)

        // Update the last prompter on the team.
        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // Prep for the next turn. Same round since there are more phrases.
        this.prepNextTurn(currentRound, nextPlayerId)
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
        // New round!!
        this.prepNewRound()

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

  async gamePreRoll() {
    // First we pick a random player to go first.
    const { firstUserId, playerIndex, firstTeam } = chooseFirstPlayer(this.game)

    // Mark on the team the index of the chosen player.
    this.game.teams.pull(firstTeam._id)
    firstTeam.lastPrompterIndex = playerIndex
    this.game.teams.push(firstTeam)

    // Now start the pre-game pre-roll!
    this.game.preRoll = {
      show: true,
      firstUserId: undefined,
    }

    await this.game.save()
    this.emit()

    // The Round Zero pre-roll is now happening on the frontend...

    // After 3 seconds from now, show who's up first.
    setTimeout(async () => {
      this.game.preRoll = {
        show: true,
        firstUserId,
      }
      await this.game.save()
      this.emit()
    }, 3000)

    // After 6 seconds from now, end pre-roll and begin round 1.
    setTimeout(async () => {
      // Reset the pre-roll.
      this.game.preRoll = {
        show: false,
        firstUserId: undefined,
      }

      await this.prepNewRound()
      this.prepNextTurn(1, firstUserId)
    }, 6000)
  }

  async prepNewRound() {
    // The unsolved phrases starts as just a shuffle of all the phrases.
    this.game.unsolvedPhraseIds = shuffleArray(this.game.phrases.map((p) => p._id))
    await this.game.save()
  }

  async prepNextTurn(roundNum: number, nextUserId: string) {
    // Create the turn.
    this.game.turns.unshift({
      userId: nextUserId,
      round: roundNum,
    })

    try {
      await this.game.save()
      this.emit()
    } catch (e) {
      throw new Error(e.message)
    }

    // The frontend is now waiting on the prompter to push Ready,
    // triggering another reflow of next().
  }

  async beginPrompting() {
    // Turn off the pre-roll.
    this.game.turns[0].showCountdown = false

    // Give the turn a start time.
    this.game.turns[0].startTime = Date.now()
    await this.game.save()
    this.emit()

    // The frontend is now showing the prompter/promptee screens and
    // the game is being played.
  }

  // Broadcast an update.
  emit() {
    io.to(this.game._id).emit(SocketMessages.GameUpdate, this.game)
  }
}
