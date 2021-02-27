import { useSelector } from 'react-redux'
import { AppState } from '../store/index'

export const useCurrentTurn = () => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) throw new Error('Game not found in useCurrentTurn')

  return game.turns[0]
}
