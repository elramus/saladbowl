import { useMemo } from 'react'
import { getUserFromUserId } from '../lib/getUserFromUserId'
import { useGame } from './useGame'

export const useCurrentPrompter = () => {
  const game = useGame()
  const currentPrompter = useMemo(() => getUserFromUserId({ userId: game.turns[0].userId, game }), [game])

  return currentPrompter
}
