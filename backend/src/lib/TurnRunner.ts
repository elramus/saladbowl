import { IGame } from '../games/games.model'
import { io } from '../app'
import { SocketMessages } from '../socket'
import { shuffleArray } from '../utils/shuffleArray'
import { IUser } from '../users/users.model'
import { decideNextPrompter } from './decideNextPrompter'
import { ITurn } from '../turns/turns.model'
import { chooseFirstPlayer } from './chooseFirstPlayer'
import { makeTeams } from './makeTeams'

interface TurnRunnerConfig {
  playerStatus?: boolean;
  timeRemaining?: number;
}

export class TurnRunner {
  private game: IGame
  private user: IUser
  private config: TurnRunnerConfig | undefined
  private fromCreator: boolean;
  private fromCurrentPlayer: boolean

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
    this.fromCreator = false // Was request from the game's host?
    this.fromCurrentPlayer = false // Was request from player who's turn it currently is?

    if (this.user._id.toString() === game.creatorId.toString()) {
      this.fromCreator = true
    }

    if (this.game.turns.length > 0
      && this.game.turns[0].userId.toString() === this.user._id.toString()
    ) {
      this.fromCurrentPlayer = true
    }
  }

  async nextAction() {
    // If any turns have been taken, get the first one to see what
    // round it is. Just don't forget to unshift new turns instead
    // of pushing :)
    const currentRound = this.game.turns.length
      ? this.game.turns[0].round
      : 0

    // If we haven't done pre-roll yet...
    if (this.fromCreator && currentRound === 0 && !this.game.preRoll.show) {
      this.prepGame()

      return
    }

    // If pre-roll just finished...
    if (this.fromCreator && currentRound === 0 && this.game.preRoll.show) {
      this.game.preRoll.show = false

      // Shuffle the phrases
      this.prepNewRound()

      // Create the next turn.
      const nextTeam = this.game.teams
        .find((t) => t._id.toString() === this.game.preRoll.firstTeamId)
      // We assigned lastPrompterIndex to the preRoll object during prepGame.
      const nextUserId = nextTeam?.userIds[nextTeam.lastPrompterIndex]
      if (nextUserId) this.addNewTurn({ roundNum: 1, nextUserId })

      return
    }

    // If the game is over...
    if (this.fromCurrentPlayer
      && currentRound === 3
      && this.game.unsolvedPhraseIds.length === 0
    ) {
      this.game.gameOver = true
      await this.game.save()
      this.emit()
    }

    const currentTurn: ITurn = this.game.turns[0]

    // If we're waiting for the current player to say they're ready to prompt...
    if (this.fromCurrentPlayer
      && currentRound > 0
      && !this.game.preRoll.show
      && !currentTurn.startTime
    ) {
      // Give 'em the countdown.
      this.game.turns[0].showCountdown = true
      await this.game.save()
      this.emit()

      // Frontend clock is counting down three seconds...

      setTimeout(async () => {
        // Turn off the countdown.
        this.game.turns[0].showCountdown = false

        // Give the turn a start time.
        this.game.turns[0].startTime = Date.now()
        await this.game.save()
        this.emit()

        // The frontend is now showing the prompter/promptee screens and
        // the game is being played.

        // When the turn is > T + 60, they see the TIME!!! screen.
        // User can trigger a nextAction from there or review results, and
        // then trigger nextAction.
      }, 3000)

      return
    }

    // If the prompting player just ran out of time...
    if (this.fromCurrentPlayer
      && currentRound > 0
      && currentTurn.startTime
      && this.game.unsolvedPhraseIds.length > 0
    ) {
      // Stay in this round, but make a new turn for the next person.
      try {
        const [nextPlayerIndex, nextPlayerId, teamUpNext] = decideNextPrompter(this.game, this.user)

        // Update the last prompter on the team.
        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // Prep for the next turn. Same round since there are more phrases.
        this.addNewTurn({
          roundNum: currentRound,
          nextUserId: nextPlayerId,
        })
      } catch (e) {
        throw new Error(e)
      }

      return
    }

    // If the prompting player just ran out of phrases...
    if (this.fromCurrentPlayer
      && currentRound > 0
      && currentTurn.startTime
      && this.game.unsolvedPhraseIds.length === 0
    ) {
      if (currentRound < 3) {
        // Put the phrases back into the bowl and shuffle!
        this.prepNewRound()

        // Create the turn.
        this.addNewTurn({
          roundNum: currentRound + 1, // Increment the round.
          nextUserId: this.user._id, // Same player.
          turnLength: this.config?.timeRemaining ?? 60, // Their remaining time.
        })
      } else {
        console.log('Game over, man.') /*eslint-disable-line*/
      }
    }
  }

  async prepGame() {
    // First, record the start time so no one else can accidentally trigger this again.
    this.game.startTime = Date.now()
    await this.game.save()

    // If we don't have teams yet, do that now.
    if (this.game.teams.length) {
      // Will automatically create teams and assign players to them.
      await makeTeams({ game: this.game, numberOfTeams: 2 })
    }

    // Now we pick a random player to go first.
    const { firstPlayerIndex, firstTeam } = chooseFirstPlayer(this.game)

    // Mark on the team the index of the chosen player.
    this.game.teams.pull(firstTeam._id)
    firstTeam.lastPrompterIndex = firstPlayerIndex
    this.game.teams.push(firstTeam)

    // Now start the pre-game pre-roll!
    this.game.preRoll = {
      show: true,
      firstTeamId: firstTeam._id,
    }

    await this.game.save()
    this.emit()

    // The frontend is now showing all the pre-roll screens.
    // After a bunch of that, the game's creator will hit pre-roll-finished endpoint.
  }

  async prepNewRound() {
    // The unsolved phrases starts as just a shuffle of all the phrases.
    this.game.unsolvedPhraseIds = shuffleArray(this.game.phrases.map((p) => p._id))
    await this.game.save()
  }

  async addNewTurn({
    roundNum,
    nextUserId,
    turnLength,
  }: {
    roundNum: number;
    nextUserId: string;
    turnLength?: number;
  }) {
    // Add turn to the beginning of the turns array.
    this.game.turns.unshift({
      userId: nextUserId,
      round: roundNum,
      turnLength: turnLength ?? 60,
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

  // Broadcast an update.
  emit() {
    io.to(this.game._id).emit(SocketMessages.GameUpdate, this.game)
  }
}
