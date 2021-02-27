import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../store/index'

export type PlayerRole = 'prompting' | 'guessing' | 'nothing'

export const usePlayerRole = (): PlayerRole => {
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  if (!game) throw new Error('Game not found in state')
  if (!user) throw new Error('User not found in state')

  const role = useMemo(() => {
    if (game.turns[0].userId === user._id) return 'prompting'
    const promptersTeam = game.teams.find(t => t.userIds.includes(game.turns[0].userId))
    if (promptersTeam?.userIds.includes(user._id)) return 'guessing'
    return 'nothing'
  }, [game.teams, game.turns, user._id])

  return role
}
