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
  const [onZeroHasFired, setOnZeroHasFired] = useState(false)

  useEffect(() => {
    function handleEnd() {
      // TODO: Is there a better way to keep this from firing over and over?
      if (onZero && !onZeroHasFired) {
        onZero()
        setOnZeroHasFired(true)
      }
    }

    if (remainingTime > 0) {
      setTimeout(() => {
        if (game?.turns[0].startTime) {
          // Round up so that we always have 1 second... if this calcs to 60,
          // and we just set state to 60 again, it doesn't trigger a refresh.
          const now = new Date()
          const gameStart = new Date(game.turns[0].startTime)
          const elapsedSeconds = Math.ceil((now.getTime() - gameStart.getTime()) / 1000)
          const remaining = (game?.turns[0].turnLength ?? 60) - elapsedSeconds
          setRemainingTime(remaining < 0 ? 0 : remaining)
        }
      }, 1000)
    } else {
      handleEnd()
    }
  }, [remainingTime, game, dispatch, onZero, onZeroHasFired])

  return remainingTime
}
