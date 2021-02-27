import { useSelector } from 'react-redux'
import { AppState } from '../store/index'

export const useGame = () => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) throw new Error('Game not found in state')

  return game
}
