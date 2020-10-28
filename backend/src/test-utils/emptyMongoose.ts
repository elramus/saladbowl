import { User } from '../users/users.model'
import { Game } from '../games/games.model'
import { Team } from '../teams/teams.model'
import { Player } from '../players/players.model'
import { Turn } from '../turns/turns.model'
import { Phrase } from '../phrases/phrases.model'

export const emptyMongoose = async () => {
  await Game.deleteMany({}).exec()
  await Phrase.deleteMany({}).exec()
  await Player.deleteMany({}).exec()
  await Team.deleteMany({}).exec()
  await Turn.deleteMany({}).exec()
  await User.deleteMany({}).exec()
}
