import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Game } from '../store/game/types'

export const useTurnCountdown = ({
  game,
  onZero,
}: {
  game: Game | null;
  onZero?: () => void;
}) => {
  const dispatch = useDispatch()
  const [remainingTime, setRemainingTime] = useState((game?.turns[0].turnLength ?? 60))

  useEffect(() => {
    function handleEnd() {
      if (onZero) onZero()
    }

    if (remainingTime > 0) {
      setTimeout(() => {
        if (game?.turns[0].startTime) {
          // Round up so that we always have 1 second... if this calcs to 60,
          // and we just set state to 60 again, it doesn't trigger a refresh.
          const now = new Date()
          const gameStart = new Date(game.turns[0].startTime)
          const elapsed = Math.ceil((now.getTime() - gameStart.getTime()) / 1000)
          const remaining = (game?.turns[0].turnLength ?? 60) - elapsed
          setRemainingTime(remaining < 0 ? 0 : remaining)
        }
      }, 1000)
    } else {
      handleEnd()
    }
  }, [remainingTime, game, dispatch, onZero])

  return remainingTime
}
