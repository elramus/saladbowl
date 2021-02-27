import { IGame } from '../games/games.model'
import { io } from '../server'
import { SocketMessages } from '../socket'
import { shuffleArray } from '../utils/shuffleArray'
import { IUser, User } from '../users/users.model'
import { decideNextPrompter } from './decideNextPrompter'
import { ITurn } from '../turns/turns.model'
import { chooseFirstPlayer } from './chooseFirstPlayer'
import { makeTeams } from './makeTeams'
import { NextActions } from './constants'

interface TurnRunnerConfig {
  playerStatus?: boolean
  timeRemaining?: number
  nextAction?: NextActions
}

export class TurnRunner {
  private game: IGame
  private user: IUser
  private config: TurnRunnerConfig | undefined
  private fromCreator: boolean
  private fromCurrentPlayer: boolean

  constructor({
    game,
    user,
    config,
  }: {
    game: IGame
    user: IUser
    config?: TurnRunnerConfig
  }) {
    this.game = game
    this.user = user
    this.config = config
    this.fromCreator = false // Was request from the game's host?
    this.fromCurrentPlayer = false // Was request from player who's turn it currently is?

    if (this.user._id.toString() === game.creatorId.toString()) {
      this.fromCreator = true
    }

    if (
      this.game.turns.length > 0 &&
      this.game.turns[0].userId.toString() === this.user._id.toString()
    ) {
      this.fromCurrentPlayer = true
    }
  }

  async nextAction(): Promise<string> {
    // If any turns have been taken, get the first one to see what
    // round it is. Just don't forget to unshift new turns instead
    // of pushing :)
    const currentRound = this.game.turns.length ? this.game.turns[0].round : 0

    // If we haven't done pre-roll yet...
    // Note: this condition is triggered from Player Ready Status.
    if (currentRound === 0 && !this.game.preRoll.show) {
      await this.prepGame()

      this.emit()
      return NextActions.FIRED_PREPGAME
    }

    // If pre-roll just finished...
    if (
      this.fromCreator &&
      currentRound === 0 &&
      this.game.preRoll.show &&
      this.game.startTime !== null
    ) {
      this.game.preRoll.show = false

      // Shuffle the phrases
      await this.prepNewRound()

      // Get the ID of the team that's up first.
      const firstTeam = this.game.teams.find(
        t => t._id.toString() === this.game.preRoll.firstTeamId.toString(),
      )
      if (!firstTeam) throw new Error('could not get the first team')

      // We assigned lastPrompterIndex to the first team during prepGame.
      const nextUserId = firstTeam.userIds[firstTeam.lastPrompterIndex]
      if (!nextUserId) throw new Error('could not get next prompter')

      try {
        await this.addNewTurn({ roundNum: 1, nextUserId })
      } catch (e) {
        throw new Error(e)
      }

      this.emit()
      return NextActions.FINISH_PREROLL_ADD_TURN
    }

    // If the game is over...
    if (
      this.fromCurrentPlayer &&
      currentRound === 3 &&
      this.game.unsolvedPhraseIds.length === 0
    ) {
      this.game.gameOver = true
      await this.game.save()

      this.emit()
      return NextActions.GAME_OVER
    }

    const currentTurn: ITurn = this.game.turns[0]

    // If we're waiting for the current player to say they're ready to prompt...
    if (
      this.fromCurrentPlayer &&
      currentRound > 0 &&
      !this.game.preRoll.show &&
      !currentTurn.startTime
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

      return NextActions.STARTING_COUNTDOWN
    }

    // If a player was skipped because they left the room...
    if (
      this.config?.nextAction === NextActions.SAME_ROUND_NEXT_PLAYER_SAME_TEAM
    ) {
      // Basically the same as a normal turn ending, except we need to pick someone from the same team.

      // Stay in this round, but make a new turn for the next person.
      try {
        const userBeingSkipped = await User.findById(this.game.turns[0].userId)
        if (!userBeingSkipped)
          throw new Error('trying to skip user that does not exist')

        const [nextPlayerIndex, nextPlayerId, teamUpNext] = decideNextPrompter(
          this.game,
          userBeingSkipped,
          true,
        )

        // Update the last prompter on the team.
        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // Prep for the next turn. Same round since there are more phrases.
        await this.addNewTurn({
          roundNum: currentRound,
          nextUserId: nextPlayerId,
        })

        this.emit()
        return NextActions.SAME_ROUND_NEXT_PLAYER_SAME_TEAM
      } catch (e) {
        throw new Error(e)
      }
    }

    // If the prompting player just ran out of time...
    if (
      this.fromCurrentPlayer &&
      currentRound > 0 &&
      currentTurn.startTime &&
      this.game.unsolvedPhraseIds.length > 0
    ) {
      // Stay in this round, but make a new turn for the next person.
      try {
        const [nextPlayerIndex, nextPlayerId, teamUpNext] = decideNextPrompter(
          this.game,
          this.user,
        )

        // Update the last prompter on the team.
        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // Prep for the next turn. Same round since there are more phrases.
        await this.addNewTurn({
          roundNum: currentRound,
          nextUserId: nextPlayerId,
        })

        this.emit()
        return NextActions.SAME_ROUND_NEXT_PLAYER
      } catch (e) {
        throw new Error(e)
      }
    }

    // If we're out of phrases...
    if (
      this.fromCurrentPlayer &&
      currentRound > 0 &&
      currentTurn.startTime &&
      this.game.unsolvedPhraseIds.length === 0
    ) {
      if (currentRound < 3) {
        // Put the phrases back into the bowl and shuffle!
        await this.prepNewRound()

        // If timeRemaining was passed in, then we know we're here because
        // someone ran out of phrases in middle of turn (usually the case).
        // But if it's not here, then that means someone solved the last
        // phrases at the turn review modal, in which case we need move
        // to the next player and the next round.
        if (this.config?.timeRemaining) {
          await this.addNewTurn({
            roundNum: currentRound + 1, // Increment the round.
            nextUserId: this.user._id, // Same player.
            turnLength: this.config.timeRemaining, // Their remaining time.
          })

          this.emit()
          return NextActions.NEXT_ROUND_SAME_PLAYER
        }

        const [nextPlayerIndex, nextPlayerId, teamUpNext] = decideNextPrompter(
          this.game,
          this.user,
        )

        this.game.teams.pull(teamUpNext._id)
        teamUpNext.lastPrompterIndex = nextPlayerIndex
        this.game.teams.push(teamUpNext)

        // New player, next round.
        await this.addNewTurn({
          roundNum: currentRound + 1,
          nextUserId: nextPlayerId,
        })

        this.emit()
        console.error(
          'next round next player? i do not really think this should happen...',
        )
        return NextActions.NEXT_ROUND_NEXT_PLAYER
      }
    }

    return NextActions.NO_ACTION
  }

  async prepGame() {
    // First, record the start time so no one else can accidentally trigger this again.
    this.game.startTime = Date.now()
    await this.game.save()

    // If we don't have teams yet, do that now.
    if (!this.game.teams.length) {
      // Will automatically create teams and assign players to them.
      await makeTeams({ game: this.game, numberOfTeams: 2 })

      // Sort the teams alphabetically. This should just make sure "Team 1"
      // is before "Team 2". We'll try anyway...
      const sortedTeams = this.game.teams
      sortedTeams.sort((t1, t2) => (t1.name > t2.name ? 1 : -1))
      this.game.teams = sortedTeams
      await this.game.save()
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

    // The frontend is now showing all the pre-roll screens.
    // After a bunch of that, the game's creator will hit pre-roll-finished endpoint.
  }

  async prepNewRound() {
    // The unsolved phrases starts as just a shuffle of all the phrases.
    this.game.unsolvedPhraseIds = shuffleArray(
      this.game.phrases.map(p => p._id),
    )
    await this.game.save()
  }

  async addNewTurn({
    roundNum,
    nextUserId,
    turnLength,
  }: {
    roundNum: number
    nextUserId: string
    turnLength?: number
  }) {
    // Get the team of the next player.
    const team = this.game.teams.find(t => t.userIds.includes(nextUserId))
    if (!team) throw new Error('Invalid user ID passed to addNewTurn')

    // Add turn to the beginning of the turns array.
    this.game.turns.unshift({
      userId: nextUserId,
      teamId: team._id,
      round: roundNum,
      turnLength: turnLength ?? 60,
    })

    // Shuffle the unsolved phrases.
    const shuffled = shuffleArray(this.game.unsolvedPhraseIds)
    this.game.unsolvedPhraseIds = shuffled

    try {
      await this.game.save()
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
