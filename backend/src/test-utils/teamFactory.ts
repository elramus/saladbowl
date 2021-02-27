import { ITeam, Team } from '../teams/teams.model'
import { playerFactory } from './playerFactory'

export const teamFactory = async (params?: Partial<ITeam>) => {
  const player1 = await playerFactory()
  const player2 = await playerFactory()
  const team = new Team({
    name: params?.name ?? 'Foo Team',
    userIds: params?.userIds ?? [player1._id, player2._id],
    score: params?.score ?? 0,
    lastPrompterIndex: params?.lastPrompterIndex ?? 0,
  })
  await team.save()
  return team
}
